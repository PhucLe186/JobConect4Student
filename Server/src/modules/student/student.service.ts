import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './student.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { StudentSkills, StudentSkillDocument } from '../skills/schema/StudentSkill.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private StudentModel: Model<StudentDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(StudentSkills.name) private StudentSkillModel: Model<StudentSkillDocument>,
  ) {}

  async getStudentbyID(user: JwtUser): Promise<object | null> {
    const { userId } = user;
    
    console.log('=== DEBUG GET STUDENT ===');
    console.log('User ID:', userId);
    
    // Lấy thông tin User
    const userData = await this.UserModel.findById(userId)
      .select('name email dateOfbirth gender')
      .lean()
      .exec();
    
    console.log('User data:', userData);
    
    if (!userData) {
      console.log('User not found!');
      return null;
    }
    
    // Lấy thông tin Student
    const studentData = await this.StudentModel.findOne({ user_id: new Types.ObjectId(userId) })
      .lean()
      .exec();
    
    console.log('Student data:', studentData);
    
    // Lấy skills của student
    let studentSkills: any[] = [];
    if (studentData) {
      console.log('Student _id:', studentData._id, 'type:', typeof studentData._id);
      const allSkills = await this.StudentSkillModel.find({}).lean().exec();
      console.log('All student_skills in DB:', JSON.stringify(allSkills));
      studentSkills = await this.StudentSkillModel
        .find({ student_id: studentData._id })
        .populate('skill_id', 'name')
        .lean()
        .exec();
      console.log('Student skills found:', studentSkills.length);
    }
    
    // Kết hợp dữ liệu
    const result = {
      name: userData.name,
      email: userData.email,
      dateOfbirth: userData.dateOfbirth,
      gender: userData.gender,
      phone: studentData?.phone || '',
      address: studentData?.address || '',
      avatar: studentData?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      school: studentData?.school || '',
      major: studentData?.major || '',
      gpa: studentData?.gpa || '',
      graduation_year: studentData?.graduation_year || '',
      career_goal: studentData?.career_goal || '',
      desired_salary: studentData?.desired_salary || '',
      skills: studentSkills // Thêm skills vào kết quả
    };
    
    console.log('Final result:', result);
    console.log('Avatar in result:', result.avatar);
    console.log('Skills in result:', result.skills);
    
    return result;
  }

  async debugStudent(user: JwtUser) {
    const { userId } = user;
    
    console.log('=== DEBUG STUDENT ===');
    console.log('User ID:', userId);
    
    // Kiểm tra User
    const userData = await this.UserModel.findById(userId).lean();
    console.log('User data:', userData);
    
    // Kiểm tra Student
    const studentData = await this.StudentModel.findOne({ user_id: new Types.ObjectId(userId) }).lean();
    console.log('Student data:', studentData);
    
    // Kiểm tra tất cả students
    const allStudents = await this.StudentModel.find().lean();
    console.log('Total students:', allStudents.length);
    
    return {
      userId,
      userData,
      studentData,
      totalStudents: allStudents.length,
      allStudents: allStudents.map(s => ({ user_id: s.user_id, avatar: s.avatar }))
    };
  }

  async updateAvatar(user: JwtUser, filename: string) {
    const { userId } = user;
    const avatarUrl = `http://localhost:5000/uploads/avatars/${filename}`;
    
    console.log('Updating avatar for user:', userId);
    console.log('Avatar URL:', avatarUrl);
    
    // Đảm bảo student record tồn tại
    let student = await this.StudentModel.findOne({ user_id: new Types.ObjectId(userId) });
    
    if (!student) {
      console.log('Student record not found, creating new one');
      student = new this.StudentModel({
        user_id: new Types.ObjectId(userId),
        avatar: avatarUrl
      });
      await student.save();
    } else {
      console.log('Student record found, updating avatar');
      student.avatar = avatarUrl;
      await student.save();
    }
    
    console.log('Final student record:', student);

    return { 
      message: 'Avatar updated successfully',
      avatarUrl 
    };
  }

  async updateProfile(user: JwtUser, profileData: any) {
    const { userId } = user;
    
    console.log('Updating profile for user:', userId);
    console.log('Profile data:', profileData);
    
    try {
      // Cập nhật thông tin User
      const userUpdateData: any = {};
      if (profileData.name) userUpdateData.name = profileData.name;
      if (profileData.dateOfBirth) userUpdateData.dateOfbirth = new Date(profileData.dateOfBirth);
      if (profileData.gender) userUpdateData.gender = profileData.gender;
      
      if (Object.keys(userUpdateData).length > 0) {
        await this.UserModel.findByIdAndUpdate(userId, userUpdateData);
        console.log('User updated:', userUpdateData);
      }
      
      // Cập nhật thông tin Student
      const studentUpdateData: any = {};
      if (profileData.phone !== undefined) studentUpdateData.phone = profileData.phone;
      if (profileData.address !== undefined) studentUpdateData.address = profileData.address;
      if (profileData.school !== undefined) studentUpdateData.school = profileData.school;
      if (profileData.major !== undefined) studentUpdateData.major = profileData.major;
      if (profileData.gpa !== undefined) studentUpdateData.gpa = profileData.gpa;
      if (profileData.graduation_year !== undefined) studentUpdateData.graduation_year = profileData.graduation_year;
      if (profileData.career_goal !== undefined) studentUpdateData.career_goal = profileData.career_goal;
      if (profileData.desired_salary !== undefined) studentUpdateData.desired_salary = profileData.desired_salary;
      
      if (Object.keys(studentUpdateData).length > 0) {
        await this.StudentModel.findOneAndUpdate(
          { user_id: new Types.ObjectId(userId) },
          studentUpdateData,
          { upsert: true, new: true }
        );
        console.log('Student updated:', studentUpdateData);
      }
      
      return {
        message: 'Profile updated successfully',
        success: true
      };
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }
}

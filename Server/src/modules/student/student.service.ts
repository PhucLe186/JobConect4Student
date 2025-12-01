import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './student.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { Skills, SkillDocument } from '../skills/schema/skills.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private StudentModel: Model<StudentDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Skills.name) private SkillsModel: Model<SkillDocument>,
  ) { }

  async getStudentbyID(user: JwtUser): Promise<object | null> {
    const { userId } = user;
    const User = await this.UserModel.findById(userId)
      .select('name email dateOfbirth gender')
      .lean()
      .exec();

    const student = await this.StudentModel.findOne({ user_id: userId })
      .populate('skills', 'name')
      .lean()
      .exec();

    const allSkills = await this.SkillsModel.find()
      .lean()
      .exec();

    const result = { ...User, ...student, allSkills };
    delete result._id;
    delete result.user_id;
    return result;
  }

  async updateStudent(user: JwtUser, updateData: any): Promise<object | null> {
    const { userId } = user;
    const { name, email, dateOfbirth, gender, skills, ...studentData } = updateData;

    // Validate graduation_year trước khi cập nhật
    if (studentData.graduation_year !== undefined) {
      const year = Number(studentData.graduation_year);
      if (isNaN(year) || year < 1900 || year > 2050) {
        throw new Error('Number nha bé');
      }
      studentData.graduation_year = year;
    }

    // Validate skills nếu có
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        studentData.skills = skills;
      } else {
        throw new Error('Skills phải là array');
      }
    }

    if (name || email || dateOfbirth || gender) {
      const userUpdateData = {};
      if (name) userUpdateData['name'] = name;
      if (email) userUpdateData['email'] = email;
      if (dateOfbirth) userUpdateData['dateOfbirth'] = dateOfbirth;
      if (gender) userUpdateData['gender'] = gender;

      await this.UserModel.findByIdAndUpdate(userId, userUpdateData);
    }

    if (Object.keys(studentData).length > 0) {
      await this.StudentModel.findOneAndUpdate(
        { user_id: userId },
        studentData,
        { upsert: true, new: true }
      );
    }

    return this.getStudentbyID(user);
  }


}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Skills, SkillDocument } from './schema/skills.schema';
import { StudentSkills, StudentSkillDocument } from './schema/StudentSkill.schema';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { Student, StudentDocument } from '../student/student.schema';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skills.name) private skillModel: Model<SkillDocument>,
    @InjectModel(StudentSkills.name) private studentSkillModel: Model<StudentSkillDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async getAllSkills() {
    return this.skillModel.find().sort({ name: 1 });
  }

  async getStudentSkills(user: JwtUser) {
    const { userId } = user;
    
    // Tìm student_id từ user_id
    const student = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });
    if (!student) {
      throw new Error('Student not found');
    }

    return this.studentSkillModel
      .find({ student_id: student._id })
      .populate('skill_id', 'name')
      .sort({ created_at: -1 });
  }

  async addStudentSkill(user: JwtUser, skillId: string, level: number) {
    const { userId } = user;
    
    // Tìm student_id từ user_id
    const student = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });
    if (!student) {
      throw new Error('Student not found');
    }

    // Kiểm tra skill có tồn tại không
    const skill = await this.skillModel.findById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Kiểm tra xem đã có skill này chưa
    const existingSkill = await this.studentSkillModel.findOne({
      student_id: student._id,
      skill_id: new Types.ObjectId(skillId)
    });

    if (existingSkill) {
      // Cập nhật level nếu đã có
      existingSkill.level = level;
      await existingSkill.save();
      return { message: 'Skill updated successfully', skill: existingSkill };
    } else {
      // Thêm mới nếu chưa có
      const newSkill = await this.studentSkillModel.create({
        student_id: student._id,
        skill_id: new Types.ObjectId(skillId),
        level: level
      });
      return { message: 'Skill added successfully', skill: newSkill };
    }
  }

  async removeStudentSkill(user: JwtUser, skillId: string) {
    const { userId } = user;
    
    // Tìm student_id từ user_id
    const student = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });
    if (!student) {
      throw new Error('Student not found');
    }

    const result = await this.studentSkillModel.deleteOne({
      student_id: student._id,
      skill_id: new Types.ObjectId(skillId)
    });

    if (result.deletedCount === 0) {
      throw new Error('Skill not found');
    }

    return { message: 'Skill removed successfully' };
  }

  async addMultipleStudentSkills(
    user: JwtUser, 
    skills: { skillId: string; level: number }[]
  ): Promise<{ message: string; addedCount: number; updatedCount: number }> {
    const { userId } = user;
    
    // Tìm student_id từ user_id
    console.log('=== addMultipleStudentSkills ===');
    console.log('userId:', userId);
    const allStudents = await this.studentModel.find().lean();
    console.log('All students in DB:', JSON.stringify(allStudents.map(s => ({ _id: s._id, user_id: s.user_id }))));
    const student = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });
    console.log('Found student:', student ? student._id : 'NULL');
    if (!student) {
      throw new Error('Student not found');
    }

    let addedCount = 0;
    let updatedCount = 0;

    // Xử lý từng skill
    for (const skillData of skills) {
      const { skillId, level } = skillData;
      
      // Kiểm tra skill có tồn tại không
      const skill = await this.skillModel.findById(skillId);
      if (!skill) {
        console.warn(`Skill with ID ${skillId} not found, skipping...`);
        continue;
      }

      // Kiểm tra xem đã có skill này chưa
      const existingSkill = await this.studentSkillModel.findOne({
        student_id: student._id,
        skill_id: new Types.ObjectId(skillId)
      });

      if (existingSkill) {
        // Cập nhật level nếu đã có
        existingSkill.level = level;
        await existingSkill.save();
        updatedCount++;
      } else {
        // Thêm mới nếu chưa có
        await this.studentSkillModel.create({
          student_id: student._id,
          skill_id: new Types.ObjectId(skillId),
          level: level
        });
        addedCount++;
      }
    }

    return { 
      message: `Thêm ${addedCount} kỹ năng mới, cập nhật ${updatedCount} kỹ năng`,
      addedCount,
      updatedCount
    };
  }
}

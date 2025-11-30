import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CSV, ResumeDocument } from './resume.schema';
import { Model, Types } from 'mongoose';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { Student, StudentDocument } from '../student/student.schema';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(CSV.name) private ResumeModel: Model<ResumeDocument>,
    @InjectModel(Student.name) private StudentModel: Model<StudentDocument>,
  ) {}

  async createResume(user: JwtUser, resumeData: any): Promise<object> {
    const { userId } = user;
    
    const student = await this.StudentModel.findOne({ user_id: userId }).exec();
    if (!student) {
      throw new Error('Student not found');
    }

    const resume = await this.ResumeModel.create({
      student_id: student._id,
      title: resumeData.title,
      template_type: resumeData.template_type,
      pdf_path: resumeData.pdf_path || '',
      public_link: resumeData.public_link || '',
      cv_data: resumeData.cv_data || {}, // Lưu toàn bộ dữ liệu CV
    });

    return resume;
  }

  async getResumesByUser(user: JwtUser): Promise<object[]> {
    const { userId } = user;
    
    const student = await this.StudentModel.findOne({ user_id: userId }).exec();
    if (!student) {
      return [];
    }

    return this.ResumeModel.find({ student_id: student._id })
      .select('title template_type pdf_path public_link created_at')
      .lean()
      .exec();
  }

  async getResumeById(id: string): Promise<object | null> {
    return this.ResumeModel.findById(id)
      .lean()
      .exec();
  }

  async updateResume(id: string, updateData: any): Promise<object | null> {
    updateData.updated_at = new Date();
    
    return this.ResumeModel.findByIdAndUpdate(id, updateData, { new: true })
      .lean()
      .exec();
  }

  async deleteResume(id: string): Promise<{ message: string }> {
    await this.ResumeModel.findByIdAndDelete(id);
    return { message: 'Resume deleted successfully' };
  }
}

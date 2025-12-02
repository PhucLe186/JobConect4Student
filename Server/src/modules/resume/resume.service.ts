import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CSV, ResumeDocument } from './resume.schema';
import { Model, Types } from 'mongoose';
import { CreateResumeDto } from './dto/create-resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(CSV.name) private ResumeModel: Model<ResumeDocument>,
  ) {}

  async createResume(studentId: string, createResumeDto: CreateResumeDto): Promise<CSV> {
    console.log('Creating resume for student:', studentId);
    console.log('Resume data:', createResumeDto);
    const resume = await this.ResumeModel.create({
      student_id: new Types.ObjectId(studentId),
      ...createResumeDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log('Resume created:', resume);
    return resume;
  }

  async saveOrUpdateResume(studentId: string, createResumeDto: CreateResumeDto, resumeId?: string): Promise<CSV> {
    if (resumeId) {
      // Cập nhật CV đã có
      const updated = await this.ResumeModel.findByIdAndUpdate(
        resumeId,
        { ...createResumeDto, updated_at: new Date() },
        { new: true }
      );
      if (!updated) {
        throw new Error('Không tìm thấy CV để cập nhật');
      }
      return updated;
    } else {
      // Tạo CV mới
      return await this.createResume(studentId, createResumeDto);
    }
  }

  async updateResume(resumeId: string, updateData: Partial<CreateResumeDto>): Promise<CSV | null> {
    return await this.ResumeModel.findByIdAndUpdate(
      resumeId,
      { ...updateData, updated_at: new Date() },
      { new: true }
    );
  }

  async getResumesByStudent(studentId: string): Promise<CSV[]> {
    return await this.ResumeModel.find({ student_id: new Types.ObjectId(studentId) });
  }

  async getResumeById(resumeId: string): Promise<CSV | null> {
    return await this.ResumeModel.findById(resumeId);
  }

  async deleteResume(resumeId: string): Promise<{ message: string }> {
    await this.ResumeModel.findByIdAndDelete(resumeId);
    return { message: 'CV đã được xóa thành công' };
  }

  async getAllResumes(): Promise<CSV[]> {
    return await this.ResumeModel.find().sort({ created_at: -1 });
  }
}

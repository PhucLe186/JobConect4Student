import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { CSV, ResumeDocument } from './resume.schema';

type SaveResumePayload = {
  title?: string;
  template_type?: string;
  cv_data?: Record<string, any>;
  avatar_data?: string;
};

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(CSV.name) private readonly resumeModel: Model<ResumeDocument>,
  ) {}

  private toObjectId(userId: string) {
    try {
      return new Types.ObjectId(userId);
    } catch (error) {
      throw new BadRequestException('User không hợp lệ');
    }
  }

  private normalizePayload(payload: SaveResumePayload) {
    const normalizedTitle =
      payload.title?.toString().trim() || 'CV chưa đặt tên';

    return {
      title: normalizedTitle,
      template_type: payload.template_type?.trim() || 'topcv-fixed',
      cv_data: payload.cv_data || {},
      avatar_data: payload.avatar_data || '',
      updated_at: new Date(),
    };
  }

  private mapResume(resume: any) {
    return {
      id: resume._id?.toString?.() || '',
      student_id: resume.student_id?.toString?.() || '',
      title: resume.title || '',
      template_type: resume.template_type || 'topcv-fixed',
      pdf_path: resume.pdf_path || '',
      public_link: resume.public_link || '',
      cv_data: resume.cv_data || {},
      avatar_data: resume.avatar_data || '',
      created_at: resume.created_at,
      updated_at: resume.updated_at,
    };
  }

  async getMyResumes(user: JwtUser) {
    const resumes = await this.resumeModel
      .find({ student_id: this.toObjectId(user.userId) })
      .sort({ updated_at: -1, created_at: -1 })
      .lean()
      .exec();

    return resumes.map((resume) => this.mapResume(resume));
  }

  async createResume(payload: SaveResumePayload, user: JwtUser) {
    const resume = await this.resumeModel.create({
      student_id: this.toObjectId(user.userId),
      pdf_path: '',
      public_link: '',
      ...this.normalizePayload(payload),
    });

    return this.mapResume(resume.toObject());
  }

  async updateResume(id: string, payload: SaveResumePayload, user: JwtUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('CV không hợp lệ');
    }

    const updatedResume = await this.resumeModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          student_id: this.toObjectId(user.userId),
        },
        {
          $set: this.normalizePayload(payload),
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedResume) {
      throw new NotFoundException('Không tìm thấy CV để cập nhật');
    }

    return this.mapResume(updatedResume);
  }

  async deleteResume(id: string, user: JwtUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('CV không hợp lệ');
    }

    const deletedResume = await this.resumeModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        student_id: this.toObjectId(user.userId),
      })
      .lean()
      .exec();

    if (!deletedResume) {
      throw new NotFoundException('Không tìm thấy CV để xóa');
    }

    return { success: true };
  }
}

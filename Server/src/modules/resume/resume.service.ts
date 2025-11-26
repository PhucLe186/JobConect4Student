import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CSV, ResumeDocument } from './resume.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(CSV.name) private ResumeModel: Model<ResumeDocument>,
  ) {}

  async resume(): Promise<{ message: string }> {
    await this.ResumeModel.create({
      student_id: new Types.ObjectId('692444b364dcc0b0399a5f39'),
      title: 'Backend Developer',
      template_type: 'Test',
      pdf_path:
        'https://res.cloudinary.com/dmfye1o7a/image/upload/v1760260066/restaurant_dif2rz.png',
      public_link:
        'https://res.cloudinary.com/dmfye1o7a/image/upload/v1760260066/restaurant_dif2rz.png',
      created_at: new Date(),
    });
    return { message: 'ok' };
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobsDocument = Jobs & Document;

@Schema({
  collection: 'jobs',
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Jobs {
  @Prop({ type: Types.ObjectId, ref: 'Employer', required: true })
  employer_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['Full-time', 'Part-time', 'Internship'],
  })
  job_type: string;

  @Prop({ required: true })
  min_salary: string;

  @Prop({ required: true })
  max_salary: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, type: Date })
  deadline: Date;

  @Prop({ default: Date.now(), type: Date })
  created_at: Date;

  @Prop({ required: true })
  industry: string;

  @Prop({
    required: true,
    enum: [
      'không yêu cầu',
      'dưới 1 năm',
      '1 năm',
      '2 năm',
      '3 năm',
      '4 năm',
      '4 năm trở lên',
    ],
  })
  experience: string;

  @Prop({ default: '' })
  requirements: string;

  @Prop({
    enum: [
      'Nhân viên',
      'Trưởng nhóm',
      'Trưởng/Phó phòng',
      'Quản lý / Giám sát',
      'Trưởng chi nhánh',
      'Phó giám đốc',
      'Giám đốc',
      'Thực tập sinh',
    ],
  })
  level: string;

  @Prop({ enum: ['pending', 'approved'], default: 'pending', required: true })
  status: string;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
JobsSchema.virtual('Employer', {
  ref: 'Employer',
  localField: 'employer_id',
  foreignField: 'user_id',
  justOne: true,
});

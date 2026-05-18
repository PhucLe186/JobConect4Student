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

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({
    required: true,
    enum: ['full-time', 'part-time', 'internship'],
  })
  job_type: string;

  @Prop({ required: true, trim: true })
  min_salary: string;

  @Prop({ required: true, trim: true })
  max_salary: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true, type: Date })
  deadline: Date;

  @Prop({ default: Date.now, type: Date })
  created_at: Date;

  @Prop({ required: true, trim: true })
  industry: string;

  @Prop({ required: true, trim: true })
  department: string;

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

  @Prop({ default: '', trim: true })
  requirements: string;

  @Prop({
    default: '',
    trim: true,
    enum: [
      '',
      'Intern',
      'Fresher',
      'Junior',
      'Middle',
      'Senior',
      'Lead',
    ],
  })
  level: string;

  @Prop({ enum: ['open', 'close', 'draft'], default: 'draft', required: true })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skills' }], default: [] })
  skills: Types.ObjectId[];

  @Prop({ type: Number, default: 0, min: 0, max: 4 })
  min_gpa: number;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);

JobsSchema.virtual('Employer', {
  ref: 'Employer',
  localField: 'employer_id',
  foreignField: 'user_id',
  justOne: true,
});

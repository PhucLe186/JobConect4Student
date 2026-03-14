import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplyJobDocument = job_applications & Document;

@Schema({ collection: 'job_applications', versionKey: false })
export class job_applications {
  @Prop({ type: Types.ObjectId, ref: 'Jobs', required: true })
  job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CV' })
  cv_id?: Types.ObjectId;

  @Prop({ type: String })
  cv_file_path?: string;

  @Prop({ type: String, required: true })
  full_name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String })
  cover_letter?: string;

  @Prop({ enum: ['sent', 'viewed', 'rejected', 'accepted'], default: 'sent' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  applied_at: Date;
}

export const jobApplySchema = SchemaFactory.createForClass(job_applications);

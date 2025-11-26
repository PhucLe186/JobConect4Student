import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplyJobDocument = job_applications & Document;

@Schema({ collection: 'job_applications', versionKey: false })
export class job_applications {
  @Prop({ type: Types.ObjectId, ref: 'Jobs', required: true })
  job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CV', required: true })
  cv_id?: Types.ObjectId;

  @Prop({ enum: ['sent', 'viewed', 'rejected', 'accepted'], default: 'sent' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  applied_at: Date;
}

export const jobApplySchema = SchemaFactory.createForClass(job_applications);

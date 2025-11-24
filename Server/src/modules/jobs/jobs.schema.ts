import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobsDocument = Jobs & Document;

@Schema({
  collection: 'jobs',
  versionKey: false,
  timestamps: true,
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
    enum: ['full-time', 'part-time', 'internship', 'contract'],
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

  @Prop({ required: true })
  created_at: string;

  @Prop({ enum: ['open', 'close', 'draft'], default: 'draft', required: true })
  status: string;
}
export const JobsSchema = SchemaFactory.createForClass(Jobs);
JobsSchema.virtual('Employer', {
  ref: 'Employer',
  localField: 'employer_id',
  foreignField: 'user_id',
  justOne: true,
});

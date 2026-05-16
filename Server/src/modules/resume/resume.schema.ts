import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ResumeDocument = CSV & Document;

@Schema({
  collection: 'CSV',
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class CSV {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, default: 'topcv-fixed' })
  template_type: string;

  @Prop({ default: '' })
  pdf_path: string;

  @Prop({ default: '' })
  public_link: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  cv_data: Record<string, any>;

  @Prop({ default: '' })
  avatar_data: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}
export const ResumeSchema = SchemaFactory.createForClass(CSV);

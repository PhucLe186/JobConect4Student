import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResumeDocument = CSV & Document;

@Schema({ collection: 'CSV', versionKey: false })
export class CSV {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  template_type: string;

  @Prop({ required: true })
  pdf_path: string;

  @Prop()
  public_link: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const ResumeSchema = SchemaFactory.createForClass(CSV);

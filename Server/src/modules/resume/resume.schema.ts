import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResumeDocument = CSV & Document;

@Schema({ _id: false })
export class Experience {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: [String], default: [] })
  tasks: string[];
}

@Schema({ _id: false })
export class Education {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  role: string;
}

@Schema({ collection: 'Template', versionKey: false })
export class CSV {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  template_type: string;

  @Prop()
  pdf_path: string;

  @Prop()
  public_link: string;

  // Thông tin cá nhân
  @Prop({ required: true })
  fullname: string;

  @Prop()
  birth: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  summary: string;

  @Prop()
  avatar: string;

  @Prop()
  brand_color: string;

  // Kỹ năng
  @Prop({ type: [String], default: [] })
  skills: string[];

  // Kinh nghiệm làm việc
  @Prop({ type: [Experience], default: [] })
  experience: Experience[];

  // Học vấn
  @Prop({ type: [Education], default: [] })
  education: Education[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}
export const ResumeSchema = SchemaFactory.createForClass(CSV);

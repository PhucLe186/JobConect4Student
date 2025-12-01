import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ collection: 'student', versionKey: false })
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  address: string;

  @Prop({
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  })
  avatar: string;

  @Prop({ default: '' })
  school: string;

  @Prop({ default: '' })
  major: string;

  @Prop({ default: '', required: false })
  gpa: string;

  @Prop({ 
    type: Number,
    required: false,
    min: [1900, 'Năm tốt nghiệp không được nhỏ hơn 1900'],
    max: [2050, 'Năm tốt nghiệp không được lớn hơn 2050']
  })
  graduation_year: number;

  @Prop({ default: '' })
  career_goal: string;

  @Prop({ default: '' })
  desired_salary: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skills' }], default: [] })
  skills: Types.ObjectId[];
}
export const StudentSchema = SchemaFactory.createForClass(Student);

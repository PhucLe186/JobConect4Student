import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentSkillDocument = StudentSkills & Document;

@Schema({ collection: 'student_skills', versionKey: false })
export class StudentSkills {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Skills', required: true })
  skill_id: Types.ObjectId;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  level: number;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const StudentSkillSchema = SchemaFactory.createForClass(StudentSkills);
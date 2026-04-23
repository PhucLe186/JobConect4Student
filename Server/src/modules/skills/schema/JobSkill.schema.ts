import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobSkillDocument = JobSkills & Document;

@Schema({ collection: 'job_skills', versionKey: false })
export class JobSkills {
  @Prop({ type: Types.ObjectId, ref: 'Jobs' })
  Job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Skills' })
  skill_id: Types.ObjectId;
}
export const SkillSchema = SchemaFactory.createForClass(JobSkills);

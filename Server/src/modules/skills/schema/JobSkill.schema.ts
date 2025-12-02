import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobSkillDocument = JobSkills & Document;

@Schema({ collection: 'job_skills', versionKey: false })
export class JobSkills {
  @Prop({ type: Types.ObjectId, ref: 'Jobs' })
  Job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SKills' })
  skill_id: Types.ObjectId;
}
export const JobSkillSchema = SchemaFactory.createForClass(JobSkills);

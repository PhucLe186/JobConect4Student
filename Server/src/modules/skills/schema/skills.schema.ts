import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillDocument = Skills & Document;

@Schema({ collection: 'skills', versionKey: false })
export class Skills {
  @Prop({ required: true })
  name: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skills);

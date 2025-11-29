import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ForumDocument = Forum & Document;

@Schema({ collection: 'Forum', versionKey: false })
export class Forum {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: null })
  image_path: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const ForumSchema = SchemaFactory.createForClass(Forum);

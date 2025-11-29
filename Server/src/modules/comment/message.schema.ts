import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

///id, post_id, user_id, content, created_at

@Schema({ collection: 'Message', versionKey: false })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Forum', required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);

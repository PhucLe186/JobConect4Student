import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Likes & Document;

@Schema({ collection: 'Likes', versionKey: false })
export class Likes {
  @Prop({ required: true, type: Types.ObjectId })
  post_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  user_id: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Likes);

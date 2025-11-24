import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TokenDocument = RefreshToken & Document;

@Schema({ collection: 'refresh_tokens', versionKey: false })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userID: Types.ObjectId;

  @Prop({ required: true })
  RefreshToken: string;

  @Prop({ required: true, type: Date })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

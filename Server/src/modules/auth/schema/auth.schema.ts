import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, required: true })
  dateOfbirth: Date;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: false })
  email_verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('Student', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmployerDocument = Employer & Document;

@Schema({ collection: 'employer', virtuals: false, versionKey: false })
export class Employer {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  company_name: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ type: Number })
  size: number;

  @Prop({ type: String, trim: true, index: true, required: true })
  industry: string;

  @Prop({ type: String, trim: true })
  address: string;

  @Prop({
    type: String,
    trim: true,
    default: '',
  })
  website: string;

  @Prop({ required: true })
  phone: string;
  @Prop({ type: String, trim: true, default: '' })
  logo: string;
}
export const EmployerSchema = SchemaFactory.createForClass(Employer);

EmployerSchema.index({
  company_name: 'text',
  description: 'text',
  industry: 1,
});
EmployerSchema.virtual('User', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

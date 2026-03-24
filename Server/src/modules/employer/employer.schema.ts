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

  @Prop({ type: Number, default: null })
  size: number | null;

  @Prop({ type: String, trim: true, index: true })
  industry: string;

  @Prop({ type: String, trim: true, default: '' })
  address: string;

  @Prop({
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props) => `${props.value} is not a valid email`,
    },
    default: '',
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    validate: {
      validator: (v: string) => !v || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v),
      message: (props) => `${props.value} is not a valid URL`,
    },
    default: '',
  })
  website: string;

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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { isEmail } from 'validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, minlength: 5, maxlength: 255 })
  name: string;

  @Prop({ required: true, validate: isEmail })
  email: string;

  @Prop({ required: true, minlength: 5, maxlength: 1024 })
  password: string;

  @Prop({ default: new Date() })
  dateCreated: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
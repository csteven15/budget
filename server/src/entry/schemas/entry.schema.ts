import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type EntryDocument = Entry & Document;

@Schema()
export class Entry {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  year: number;

  // 0 = income
  // 1 = expense
  @Prop({ required: true })
  inputType: Number;

  @Prop({ required: true })
  monthlyAmount: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  @Prop()
  maxAmount: number;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

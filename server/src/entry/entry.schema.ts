import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Amount } from '../amount/amount.schema';

export type EntryDocument = Entry & Document;

@Schema()
export class Entry {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  // 0 = income
  // 1 = expense
  @Prop({ required: true })
  type: number;

  @Prop({ required: true })
  budgetedAmount: number;

  @Prop({ required: true })
  createdAt: Date;

  startDate: Date;

  endDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: Amount.name }] })
  amounts: Amount[];
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

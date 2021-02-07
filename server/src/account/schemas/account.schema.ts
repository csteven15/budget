import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  name: string;

  // 0 = checking
  // 1 = savings
  // 2 = investment
  // 3 = retirement
  @Prop({ required: true })
  type: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  isAppliedToBudget: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

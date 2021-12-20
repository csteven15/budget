import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Field,
  ObjectType,
  ID,
  Int,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Document, Types } from 'mongoose';
import { Amount } from '../amount/amount.schema';

export type EntryDocument = Entry & Document;

@ObjectType()
@Schema()
export class Entry {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true })
  userId: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  // 0 = income
  // 1 = expense
  @Field(() => Int)
  @Prop({ required: true })
  type: number;

  @Field(() => Float)
  @Prop({ required: true })
  budgetedAmount: number;

  @Field(() => GraphQLISODateTime)
  @Prop({ required: true })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  endDate: Date;

  @Field(() => [Amount], { nullable: true })
  @Prop({ type: [{ type: Types.ObjectId, ref: Amount.name }] })
  amounts: Amount[];
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

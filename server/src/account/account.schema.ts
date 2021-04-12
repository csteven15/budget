import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

@ObjectType()
@Schema()
export class Account {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true })
  userId: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  // 0 = checking
  // 1 = savings
  // 2 = investment
  // 3 = retirement
  @Field(() => Int)
  @Prop({ required: true })
  type: number;

  @Field(() => Float)
  @Prop({ required: true })
  total: number;

  @Field(() => Boolean)
  @Prop({ required: true })
  appliedToBudget: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

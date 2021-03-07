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

export type AmountDocument = Amount & Document;

@ObjectType()
@Schema()
export class Amount {
  @Field(() => ID)
  @Prop({ required: true })
  entryId: Types.ObjectId;

  @Field(() => GraphQLISODateTime)
  @Prop({ required: true })
  date: Date;

  @Field(() => Float)
  @Prop({ required: true })
  amount: number;

  @Field(() => Boolean)
  @Prop({ required: true, default: false})
  isPaid: boolean;
}

export const AmountSchema = SchemaFactory.createForClass(Amount);

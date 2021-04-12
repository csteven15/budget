import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Field,
  ObjectType,
  ID,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

export type AmountDocument = Amount & Document;

@ObjectType()
@Schema()
export class Amount {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ required: true })
  entryId: Types.ObjectId;

  @Field(() => GraphQLISODateTime)
  @Prop({ required: false, default: new Date() })
  date: Date;

  @Field(() => Float)
  @Prop({ required: true })
  amount: number;

  @Field(() => Boolean)
  @Prop({ required: true, default: false })
  paid: boolean;
}

export const AmountSchema = SchemaFactory.createForClass(Amount);

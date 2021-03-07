import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType()
export class CreateEntryInput {
  @Field(() => String)
  @ApiProperty({ required: true })
  userId: string;
  @Field(() => String)
  @ApiProperty({ required: true })
  name: string;
  @Field(() => Int)
  @ApiProperty({ required: true })
  type: number;
  @Field(() => Float)
  @ApiProperty({ required: true })
  budgetedAmount: number;
  // createdAt will be auto populated
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  startDate: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  endDate: Date;

  // for the form
  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  frequency: number;
}

@InputType()
export class GetEntryInput {
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
  _id?: Types.ObjectId;
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  userId?: string;
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  name?: string;
  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  type?: number;
}

@InputType()
export class GetEntryDateFilterInput {
  // filter date range
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  startDate?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  endDate?: Date;
}

@InputType()
export class UpdateEntryInput {
  @Field(() => ID)
  @ApiProperty({ required: true })
  _id: Types.ObjectId;
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  userId: string;
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  name: string;
  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  type: number;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  startDate: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  endDate: Date;
}

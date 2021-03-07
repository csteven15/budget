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
  @Field(() => ID)
  @ApiProperty({ required: true })
  userId: Types.ObjectId;
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
  @Field(() => GraphQLISODateTime)
  @ApiProperty()
  startDate: Date;
  @Field(() => GraphQLISODateTime)
  @ApiProperty()
  endDate: Date;

  // for the form
  @Field(() => Int)
  @ApiProperty()
  frequency: number;
}

@InputType()
export class GetEntryInput {
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
  _id?: Types.ObjectId;
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
  userId?: Types.ObjectId;
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  name?: string;
  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false })
  type?: number;
  
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
  @ApiProperty()
  _id: Types.ObjectId;
  @Field(() => ID)
  @ApiProperty()
  userId: Types.ObjectId;
  @Field(() => String)
  @ApiProperty()
  name: string;
  @Field(() => Int)
  @ApiProperty()
  type: number;
  @Field(() => GraphQLISODateTime)
  @ApiProperty()
  startDate: Date;
  @Field(() => GraphQLISODateTime)
  @ApiProperty()
  endDate: Date;
}

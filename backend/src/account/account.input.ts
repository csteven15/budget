import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType()
export class CreateAccountInput {
  @Field(() => ID)
  @ApiProperty({ required: true })
  userId: string;
  @Field(() => String)
  @ApiProperty({ required: true })
  name: string;
  @Field(() => Int)
  @ApiProperty({ required: true })
  type: number;
  @Field(() => Int)
  @ApiProperty({ required: true })
  total: number;
  @Field(() => Boolean)
  @ApiProperty({ required: false })
  appliedToBudget: boolean;
}

@InputType()
export class GetAccountInput {
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
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
  @Field(() => Float, { nullable: true })
  @ApiProperty({ required: false })
  total: number;
  @Field(() => Boolean, { nullable: true })
  @ApiProperty({ required: false })
  appliedToBudget: boolean;
}

@InputType()
export class UpdateAccountInput {
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
  @Field(() => Float, { nullable: true })
  @ApiProperty({ required: false })
  total: number;
  @Field(() => Boolean, { nullable: true })
  @ApiProperty({ required: false })
  appliedToBudget: boolean;
}

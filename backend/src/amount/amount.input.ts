import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  InputType,
} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType()
export class CreateAmountInput {
  @Field(() => ID)
  @ApiProperty({ required: true })
  entryId: Types.ObjectId;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: true })
  date: Date;
  @Field(() => Float)
  @ApiProperty({ required: true })
  amount: number;
  @Field(() => Boolean, { nullable: true })
  @ApiProperty({ required: false })
  paid: boolean;
}

@InputType()
export class GetAmountInput {
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
  _id?: Types.ObjectId;
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
  entryId?: Types.ObjectId;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  date?: Date;
  @Field(() => Float, { nullable: true })
  @ApiProperty({ required: false })
  amount?: number;
  @Field(() => Boolean, { nullable: true })
  @ApiProperty({ required: false })
  paid?: boolean;
}

@InputType()
export class UpdateAmountInput {
  @Field(() => ID)
  @ApiProperty({ required: true })
  _id?: Types.ObjectId;
  @Field(() => ID, { nullable: true })
  @ApiProperty({ required: false })
  entryId?: Types.ObjectId;
  @Field(() => GraphQLISODateTime, { nullable: true })
  @ApiProperty({ required: false })
  date?: Date;
  @Field(() => Float, { nullable: true })
  @ApiProperty({ required: false })
  amount?: number;
  @Field(() => Boolean, { nullable: true })
  @ApiProperty({ required: false })
  paid?: boolean;
}

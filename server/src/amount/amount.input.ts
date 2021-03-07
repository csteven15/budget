import { Field, Float, GraphQLISODateTime, ID, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@InputType()
export class CreateAmountInput {
  @Field(() => ID)
  @ApiProperty({ required: true })
  entryId: Types.ObjectId;
  @Field(() => GraphQLISODateTime)
  @ApiProperty({ required: true })
  date: Date;
  @Field(() => Float)
  @ApiProperty({ required: true })
  amount: number;
}

@InputType()
export class GetAmountInput {
  @Field(() => ID)
  @ApiProperty()
  _id?: Types.ObjectId;
  @Field(() => ID)
  @ApiProperty()
  entryId?: Types.ObjectId;
  @Field(() => GraphQLISODateTime)
  @ApiProperty()
  date?: Date;
  @Field(() => Float)
  @ApiProperty()
  amount?: number;
}

@InputType()
export class UpdateAmountInput {
  @Field(() => ID)
  @ApiProperty()
  _id: Types.ObjectId;
  @Field(() => ID)
  @ApiProperty()
  entryId: Types.ObjectId;
  @Field(() => GraphQLISODateTime)
  @ApiProperty()
  date: Date;
  @Field(() => Float)
  @ApiProperty()
  amount: number;
}

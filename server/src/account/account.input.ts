import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateAccountInput {
  @ApiProperty()
  uid: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  isApplieInputsBudget: boolean;
}

export class UpdateAccountInput {
  @ApiProperty()
  _id: Types.ObjectId;
  @ApiProperty()
  uid: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  isApplieInputsBudget: boolean;
}

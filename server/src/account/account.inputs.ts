import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountInputs {
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

export class UpdateAccountInputs {
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

import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty()
  uid: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  isAppliedToBudget: boolean;
}

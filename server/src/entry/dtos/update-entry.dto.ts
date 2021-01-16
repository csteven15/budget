import { ApiProperty } from '@nestjs/swagger';

export class UpdateEntryDto {
  @ApiProperty()
  user: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  inputType: number;
  @ApiProperty()
  monthlyAmount: number[];
  @ApiProperty()
  maxAmount: number;
}
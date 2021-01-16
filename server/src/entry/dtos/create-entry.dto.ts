import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryDto {
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
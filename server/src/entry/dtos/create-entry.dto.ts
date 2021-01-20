import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryDto {
  @ApiProperty()
  uid: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  inputType: number;
  @ApiProperty()
  monthlyAmount: number[];
  @ApiProperty()
  maxAmount: number;
}

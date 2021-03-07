import { ApiProperty } from '@nestjs/swagger';

export class UpdateAmountInputs {
  @ApiProperty()
  entryId: string;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  amount: number;
}

export class CreateAmountInputs {
  @ApiProperty({ required: true })
  entryId: string;
  @ApiProperty({ required: true })
  date: Date;
  @ApiProperty({ required: true })
  amount: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryInputs {
  @ApiProperty({ required: true })
  userId: string;
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  type: number;
  @ApiProperty({ required: true })
  budgetedAmount: number;
  // createdAt will be auto populated
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  frequency: number;
}

export class GetEntryInputs {
  @ApiProperty({ required: true })
  startDate: Date;
  @ApiProperty({ required: true })
  endDate: Date;
}

export class UpdateEntryInputs {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}

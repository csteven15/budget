import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  id: string;
}
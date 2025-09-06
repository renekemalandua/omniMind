import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetUserPasswordDTO {
  @ApiProperty({
    required: true,
    description: 'email is required',
    example: 'test@gmail.com',
  })
  @IsString()
  email: string;
}

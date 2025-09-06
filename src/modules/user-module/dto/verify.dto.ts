import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class verifyUserDTO {
  @ApiProperty({
    required: true,
    description: 'token must be a string and valid token',
    example: '74929826-25e1-4025-b122-f64ead84fe0f',
  })
  @IsString()
  token: string;
}

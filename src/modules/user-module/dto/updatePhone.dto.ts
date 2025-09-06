import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePhoneDTO {
  @ApiProperty({
    required: true,
    description: 'id must be a string',
    example: '74929826-25e1-4025-b122-f64ead84fe0f',
  })
  @IsString()
  id: string;

  @ApiProperty({
    required: true,
    description: 'phone number is string',
    example: '923000111',
  })
  @IsString()
  newPhone: string;
}

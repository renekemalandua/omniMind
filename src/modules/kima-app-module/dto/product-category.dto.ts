import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProductCategoryRequestDTO {
  @ApiProperty({ example: 'Vegetables' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Fresh vegetables from local farms' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProductCategoryRequestDTO {
  @ApiPropertyOptional({ example: 'Leafy Vegetables' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description for category' })
  @IsOptional()
  @IsString()
  description?: string;
}
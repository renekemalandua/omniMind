import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateProductRequestDTO {
  @ApiProperty({ example: 'uuid-of-owner' })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'Tomatoes' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Fresh organic tomatoes from the farm' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class UpdateProductRequestDTO {
  @ApiPropertyOptional({ example: 'Updated Product Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'uuid-of-new-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Updated description for the product' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}
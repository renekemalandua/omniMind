import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePropertyCategoryRequestDTO {
	@ApiProperty({ example: 'Apartamento' })
	@IsString()
	name: string;

	@ApiPropertyOptional({ example: 'Imóveis do tipo apartamento' })
	@IsOptional()
	@IsString()
	description?: string;
}

export class UpdatePropertyCategoryRequestDTO {
	@ApiPropertyOptional({ example: 'Apartamento' })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ example: 'Imóveis do tipo apartamento' })
	@IsOptional()
	@IsString()
	description?: string;
}


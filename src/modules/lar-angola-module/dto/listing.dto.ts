import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateListingRequestDTO {
	@ApiProperty({ example: 'uuid-of-property' })
	@IsUUID()
	propertyId: string;

	@ApiProperty({ example: 'uuid-of-owner' })
	@IsUUID()
	ownerId: string;

	@ApiProperty({ example: 'rent', enum: ['rent', 'sale'] })
	@IsEnum(['rent', 'sale'] as any)
	transactionType: 'rent' | 'sale';

	@ApiProperty({ example: 250000 })
	@IsNumber()
	@Min(0)
	price: number;

	@ApiPropertyOptional({ example: 'AOA' })
	@IsOptional()
	@IsString()
	currency?: string;
}

export class UpdateListingRequestDTO {
	@ApiPropertyOptional({ example: 'rent', enum: ['rent', 'sale'] })
	@IsOptional()
	@IsEnum(['rent', 'sale'] as any)
	transactionType?: 'rent' | 'sale';

	@ApiPropertyOptional({ example: 230000 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	price?: number;

	@ApiPropertyOptional({ example: 'AOA' })
	@IsOptional()
	@IsString()
	currency?: string;

	@ApiPropertyOptional({ example: 'inactive', enum: ['active', 'inactive'] })
	@IsOptional()
	@IsEnum(['active', 'inactive'] as any)
	status?: 'active' | 'inactive';
}


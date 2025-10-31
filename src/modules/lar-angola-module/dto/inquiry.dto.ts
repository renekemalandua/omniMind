import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInquiryRequestDTO {
	@ApiProperty({ example: 'uuid-of-listing' })
	@IsUUID()
	listingId: string;

	@ApiPropertyOptional({ example: 'uuid-of-user' })
	@IsOptional()
	@IsUUID()
	userId?: string;

	@ApiProperty({ example: 'João Silva' })
	@IsString()
	name: string;

	@ApiProperty({ example: 'joao@email.com' })
	@IsEmail()
	email: string;

	@ApiPropertyOptional({ example: '+244...' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({ example: 'Tenho interesse no imóvel, podemos agendar visita?' })
	@IsString()
	message: string;
}


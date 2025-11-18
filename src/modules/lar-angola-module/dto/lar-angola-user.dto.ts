import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum LarAngolaUserRoleDTO {
	intermediary = 'intermediary',
	client = 'client',
	company = 'company',
}

export class CreateLarAngolaUserRequestDTO {
	@ApiProperty({ example: 'uuid-of-user' })
	@IsUUID()
	userId: string;

	@ApiProperty({ enum: LarAngolaUserRoleDTO })
	@IsEnum(LarAngolaUserRoleDTO)
	role: LarAngolaUserRoleDTO;

	@ApiProperty({ example: 'João Silva' })
	@IsString()
	fullName: string;

	@ApiPropertyOptional({ example: '+244900000000' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiPropertyOptional({ example: 'Luanda' })
	@IsOptional()
	@IsString()
	city?: string;

	@ApiPropertyOptional({ description: 'JSON preferences' })
	@IsOptional()
	preferences?: unknown;
}

export class UpdateLarAngolaUserRequestDTO {
	@ApiPropertyOptional({ enum: LarAngolaUserRoleDTO })
	@IsOptional()
	@IsEnum(LarAngolaUserRoleDTO)
	role?: LarAngolaUserRoleDTO;

	@ApiPropertyOptional({ example: 'João Silva' })
	@IsOptional()
	@IsString()
	fullName?: string;

	@ApiPropertyOptional({ example: '+244900000000' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiPropertyOptional({ example: 'Luanda' })
	@IsOptional()
	@IsString()
	city?: string;

	@ApiPropertyOptional({ description: 'JSON preferences' })
	@IsOptional()
	preferences?: unknown;
}

export enum VerificationStatusDTO {
	pending = 'pending',
	approved = 'approved',
	rejected = 'rejected',
}

export class SubmitVerificationRequestDTO {
	@ApiProperty({ example: '+244900000000' })
	@IsString()
	phone: string;

	@ApiPropertyOptional({ example: '123456789' })
	@IsOptional()
	@IsString()
	nif?: string;

	@ApiProperty({ example: ['Luanda', 'Bengo'] })
	@IsArray()
	zonesOfOperation: string[];

	@ApiProperty({ example: 'base64-encoded-image' })
	@IsString()
	biFrente: string;

	@ApiProperty({ example: 'base64-encoded-image' })
	@IsString()
	biVerso: string;

	@ApiProperty({ example: 'base64-encoded-image' })
	@IsString()
	foto: string;
}



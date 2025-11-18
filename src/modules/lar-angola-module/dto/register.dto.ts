import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { LarAngolaUserRoleDTO } from './lar-angola-user.dto';

export class RegisterLarAngolaUserRequestDTO {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: '+244900000000' })
	@IsString()
	phone: string;

	@ApiProperty({ example: 'StrongPassword123!' })
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty({ enum: LarAngolaUserRoleDTO })
	@IsEnum(LarAngolaUserRoleDTO)
	role: LarAngolaUserRoleDTO;

	@ApiProperty({ example: 'João Silva' })
	@IsString()
	fullName: string;

	@ApiPropertyOptional({ example: 'Luanda' })
	@IsOptional()
	@IsString()
	city?: string;

	@ApiPropertyOptional({ description: 'Informações adicionais do usuário' })
	@IsOptional()
	preferences?: unknown;

	@ApiPropertyOptional({ example: 'Empresa XPTO' })
	@IsOptional()
	@IsString()
	companyName?: string;

	@ApiPropertyOptional({ example: 'Luanda' })
	@IsOptional()
	@IsString()
	companyLocation?: string;

	@ApiPropertyOptional({ example: '500101010' })
	@IsOptional()
	@IsString()
	nif?: string;
}









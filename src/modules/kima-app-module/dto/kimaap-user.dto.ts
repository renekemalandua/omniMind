import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum KimaAppUserType {
    FARMER = 'farmer',
    COMPANY = 'company',
    DRIVER = 'driver',
    SELLER = 'seller',
}

export class CreateKimaAppUserRequestDTO {

    @ApiProperty({ example: 'uuid-of-central-user' })
    userId: string;

    @ApiProperty({ example: 'Farm Bom Sabor' })
    @IsString()
    name: string;

    @ApiProperty({ enum: KimaAppUserType, example: KimaAppUserType.FARMER })
    @IsEnum(KimaAppUserType)
    type: KimaAppUserType;

}

export class UpdateKimaAppUserRequestDTO {
    @ApiPropertyOptional({ example: 'Updated Farm Name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '5000000000' })
    @IsOptional()
    @IsString()
    nif?: string;

    @ApiPropertyOptional({ example: 'South Region' })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiPropertyOptional({ example: 'New Address' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional()
    @IsNumber()
    farmSize?: number;

    @ApiPropertyOptional({ example: 'Importer' })
    @IsOptional()
    @IsString()
    companyType?: string;

    @ApiPropertyOptional({ example: 'Van' })
    @IsOptional()
    @IsString()
    vehicleType?: string;

    @ApiPropertyOptional({ example: 'DR987654' })
    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @ApiPropertyOptional({ example: 'Seeds, Fertilizers' })
    @IsOptional()
    @IsString()
    productsCarried?: string;
}
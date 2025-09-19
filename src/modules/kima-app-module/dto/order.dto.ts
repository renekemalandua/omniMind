import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export class CreateOrderRequestDTO {
  @ApiProperty({ example: 'uuid-of-product' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'uuid-of-buyer' })
  @IsString()
  buyerId: string;

  @ApiPropertyOptional({ example: 'uuid-of-driver' })
  @IsOptional()
  @IsString()
  driverId?: string;
}

export class UpdateOrderRequestDTO {
  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.IN_TRANSIT })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: 'uuid-of-driver' })
  @IsOptional()
  @IsString()
  driverId?: string;
}

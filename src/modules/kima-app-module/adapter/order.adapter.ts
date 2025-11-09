import { Prisma, $Enums } from "@prisma/client";
import { OrderEntity } from "../entities";
import { IdValueObject } from '../../../shared';

type OrderWithProducts = Prisma.OrderGetPayload<{ include: { products: true } }>;

export class OrderAdapter {

	static toDomain(order: OrderWithProducts): OrderEntity {
		const [firstProduct] = order.products ?? [];
		if (!firstProduct) {
			throw new Error('Order is missing associated products');
		}

		return OrderEntity.create(
			{
				productId: firstProduct.productId,
				buyerId: order.buyerId,
				driverId: order.driverId ?? null,
				status: order.status,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			},
			new IdValueObject(order.id),
		);
	}

	static toPrismaCreate(entity: OrderEntity): Prisma.OrderCreateInput {
		return {
			buyer: { connect: { id: entity.buyerId } },
			driver: entity.driverId ? { connect: { id: entity.driverId } } : undefined,
			status: entity.status as $Enums.OrderStatus,
			products: {
				create: [
					{
						product: { connect: { id: entity.productId } },
					},
				],
			},
		};
	}

	static toPrismaUpdate(entity: OrderEntity): Prisma.OrderUpdateInput {
		return {
			driver: entity.driverId
				? { connect: { id: entity.driverId } }
				: { disconnect: true },
			status: entity.status as $Enums.OrderStatus,
		};
	}

	static toHttp(
		entity: OrderEntity,
		product: HTTP.KimaApp.ProductResponse,
		buyer: HTTP.KimaApp.CompanyUserResponse | HTTP.KimaApp.SellerUserResponse,
		driver: HTTP.KimaApp.DriverUserResponse | null = null
	): HTTP.KimaApp.OrderResponse {
		return {
			id: entity.id,
			status: entity.status,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			product,
			buyer,
			driver,
		};
	}
}

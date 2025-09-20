import { Order } from "@prisma/client";
import { OrderEntity } from "../entities";
import { IdValueObject } from '../../../shared';

export class OrderAdapter {

    static toDomain(order: Order): OrderEntity {
        return OrderEntity.create(
            {
                productId: order.productId,
                buyerId: order.buyerId,
                driverId: order.driverId ?? null,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
            new IdValueObject(order.id),
        );
    }

    static toPrisma(entity: OrderEntity): Order {
        return {
            id: entity.id,
            productId: entity.productId,
            buyerId: entity.buyerId,
            driverId: entity.driverId ?? null,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
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

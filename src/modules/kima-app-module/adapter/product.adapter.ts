import { Product } from "@prisma/client";
import { ProductEntity } from "../entities";
import { IdValueObject } from '../../../shared';

export class ProductAdapter {

    static toDomain(product: Product): ProductEntity {
        return ProductEntity.create(
            {
                ownerId: product.ownerId,
                categoryId: product.categoryId,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            },
            new IdValueObject(product.id),
        );
    }

    static toPrisma(entity: ProductEntity): Product {
        return {
            id: entity.id,
            ownerId: entity.ownerId,
            categoryId: entity.categoryId,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            quantity: entity.quantity,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toHttp(
        entity: ProductEntity,
        owner: HTTP.KimaApp.FarmerUserResponse,
        category: HTTP.KimaApp.ProductCategoryResponse
    ): HTTP.KimaApp.ProductResponse {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            quantity: entity.quantity,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            owner,
            category,
        };
    }
}

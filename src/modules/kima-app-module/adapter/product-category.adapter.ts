import { ProductCategory } from "@prisma/client";
import { ProductCategoryEntity } from "../entities";
import { IdValueObject } from '../../../shared';

export class ProductCategoryAdapter {

    static toDomain(category: ProductCategory): ProductCategoryEntity {
        return ProductCategoryEntity.create(
            {
                name: category.name,
                description: category.description,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            },
            new IdValueObject(category.id),
        );
    }

    static toPrisma(entity: ProductCategoryEntity): ProductCategory {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toHttp(
        entity: ProductCategoryEntity,
        products: HTTP.KimaApp.ProductResponse[] = []
    ): HTTP.KimaApp.ProductCategoryResponse {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            products,
        };
    }
}

import { PropertyCategoryLA } from '@prisma/client';
import { PropertyCategoryEntity } from '../entities';
import { IdValueObject } from '../../../shared';

export class PropertyCategoryAdapter {
	static toDomain(raw: PropertyCategoryLA): PropertyCategoryEntity {
		return PropertyCategoryEntity.create(
			{
				name: raw.name,
				description: raw.description,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: PropertyCategoryEntity): PropertyCategoryLA {
		return {
			id: entity.id,
			name: entity.name,
			description: entity.description,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: PropertyCategoryEntity, properties: any[] = []) {
		return {
			id: entity.id,
			name: entity.name,
			description: entity.description,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			properties,
		};
	}
}


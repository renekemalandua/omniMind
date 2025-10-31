import { ListingLA } from '@prisma/client';
import { ListingEntity } from '../entities';
import { IdValueObject } from '../../../shared';

export class ListingAdapter {
	static toDomain(raw: ListingLA): ListingEntity {
		return ListingEntity.create(
			{
				propertyId: raw.propertyId,
				ownerId: raw.ownerId,
				transactionType: raw.transactionType === 'rent' ? 'rent' : 'sale',
				price: raw.price,
				currency: raw.currency,
				status: raw.status === 'active' ? 'active' : 'inactive',
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: ListingEntity): ListingLA {
		return {
			id: entity.id,
			propertyId: entity.propertyId,
			ownerId: entity.ownerId,
			transactionType: entity.transactionType as any,
			price: entity.price,
			currency: entity.currency,
			status: entity.status as any,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(
		entity: ListingEntity,
		property: HTTP.LarAngola.PropertyResponse,
		owner: HTTP.LarAngola.UserResponse,
	): HTTP.LarAngola.ListingResponse {
		return {
			id: entity.id,
			transactionType: entity.transactionType as any,
			price: entity.price,
			currency: entity.currency,
			status: entity.status as any,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			property,
			owner,
		};
	}
}



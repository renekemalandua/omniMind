// Using untyped prisma row to avoid coupling to generated client types here
import { PropertyEntity } from '../entities';
import { IdValueObject } from '../../../shared';

export class PropertyAdapter {
	static toDomain(raw: any): PropertyEntity {
		return PropertyEntity.create(
			{
				ownerId: raw.ownerId,
				categoryId: raw.categoryId,
				title: raw.title,
				description: raw.description,
				address: raw.address,
				city: raw.city,
				state: raw.state,
				country: raw.country,
				latitude: raw.latitude,
				longitude: raw.longitude,
				bedrooms: raw.bedrooms,
				bathrooms: raw.bathrooms,
				areaSqm: raw.areaSqm,
				amenities: raw.amenities as unknown,
				images: raw.images as unknown,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: PropertyEntity): any {
		return {
			id: entity.id,
			ownerId: entity.ownerId,
			categoryId: entity.categoryId,
			title: entity.title,
			description: entity.description,
			address: entity.address,
			city: entity.city,
			state: entity.state,
			country: entity.country,
			latitude: entity.latitude as any,
			longitude: entity.longitude as any,
			bedrooms: entity.bedrooms as any,
			bathrooms: entity.bathrooms as any,
			areaSqm: entity.areaSqm as any,
			amenities: entity.amenities as any,
			images: entity.images as any,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(
		entity: PropertyEntity,
		owner: HTTP.LarAngola.UserResponse,
		category: HTTP.LarAngola.PropertyCategoryResponse,
	): HTTP.LarAngola.PropertyResponse {
		return {
			id: entity.id,
			title: entity.title,
			description: entity.description,
			address: entity.address,
			city: entity.city,
			state: entity.state,
			country: entity.country,
			latitude: entity.latitude,
			longitude: entity.longitude,
			bedrooms: entity.bedrooms,
			bathrooms: entity.bathrooms,
			areaSqm: entity.areaSqm,
			amenities: entity.amenities,
			images: entity.images,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			owner,
			category,
		};
	}
}



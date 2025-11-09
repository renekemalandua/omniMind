import { InquiryLA } from '@prisma/client';
import { InquiryEntity } from '../entities';
import { IdValueObject } from '../../../shared';

export class InquiryAdapter {
	static toDomain(raw: InquiryLA): InquiryEntity {
		return InquiryEntity.create(
			{
				listingId: raw.listingId,
				userId: raw.userId ?? null,
				name: raw.name,
				email: raw.email,
				phone: raw.phone ?? null,
				message: raw.message,
				createdAt: raw.createdAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: InquiryEntity): InquiryLA {
		return {
			id: entity.id,
			listingId: entity.listingId,
			userId: entity.userId ?? null,
			name: entity.name,
			email: entity.email,
			phone: entity.phone ?? null,
			message: entity.message,
			createdAt: entity.createdAt,
		};
	}

	static toHttp(
		entity: InquiryEntity,
		listing: HTTP.LarAngola.ListingResponse | { id: string } | null,
		user: HTTP.LarAngola.UserResponse | null,
	): HTTP.LarAngola.InquiryResponse {
		return {
			id: entity.id,
			name: entity.name,
			email: entity.email,
			phone: entity.phone,
			message: entity.message,
			createdAt: entity.createdAt,
			listingId: entity.listingId,
			user,
		};
	}
}



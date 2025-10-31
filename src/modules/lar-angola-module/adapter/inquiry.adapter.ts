// Using untyped prisma row to avoid coupling to generated client types here
import { InquiryEntity } from '../entities';
import { IdValueObject } from '../../../shared';

export class InquiryAdapter {
	static toDomain(raw: any): InquiryEntity {
		return InquiryEntity.create(
			{
				listingId: raw.listingId,
				userId: raw.userId,
				name: raw.name,
				email: raw.email,
				phone: raw.phone,
				message: raw.message,
				createdAt: raw.createdAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: InquiryEntity): any {
		return {
			id: entity.id,
			listingId: entity.listingId,
			userId: entity.userId as any,
			name: entity.name,
			email: entity.email,
			phone: entity.phone as any,
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



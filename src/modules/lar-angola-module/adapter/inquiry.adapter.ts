import { InquiryLA } from '@prisma/client';
import { InquiryEntity } from '../entities';
import { IdValueObject } from '../../../shared';

export class InquiryAdapter {
	static toDomain(raw: InquiryLA): InquiryEntity {
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

	static toPrisma(entity: InquiryEntity): InquiryLA {
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

	static toHttp(entity: InquiryEntity, listing: any, user: any | null) {
		return {
			id: entity.id,
			name: entity.name,
			email: entity.email,
			phone: entity.phone,
			message: entity.message,
			createdAt: entity.createdAt,
			listing,
			user,
		};
	}
}



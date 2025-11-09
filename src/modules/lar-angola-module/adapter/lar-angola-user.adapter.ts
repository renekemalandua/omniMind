import { LarAngolaUser, Prisma } from '@prisma/client';
import { LarAngolaUserEntity } from '../entities/lar-angola-user.entity';
import { IdValueObject } from '../../../shared';

export class LarAngolaUserAdapter {
	static toDomain(raw: LarAngolaUser): LarAngolaUserEntity {
		return LarAngolaUserEntity.create(
			{
				userId: raw.userId,
				role: raw.role,
				fullName: raw.fullName,
				phone: raw.phone ?? null,
				city: raw.city ?? null,
				preferences: raw.preferences ?? null,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: LarAngolaUserEntity): LarAngolaUser {
		return {
			id: entity.id,
			userId: entity.userId,
			role: entity.role,
			fullName: entity.fullName,
			phone: entity.phone ?? null,
			city: entity.city ?? null,
			preferences: (entity.preferences as any) ?? null,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: LarAngolaUserEntity): HTTP.LarAngola.UserResponse {
		return {
			id: entity.id,
			userId: entity.userId,
			role: entity.role,
			fullName: entity.fullName,
			phone: entity.phone,
			city: entity.city,
			preferences: entity.preferences,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


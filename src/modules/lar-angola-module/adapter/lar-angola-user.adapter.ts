// Using untyped prisma row to avoid coupling to generated client types here
import { LarAngolaUserEntity } from '../entities/lar-angola-user.entity';
import { IdValueObject } from '../../../shared';

export class LarAngolaUserAdapter {
	static toDomain(raw: any): LarAngolaUserEntity {
		return LarAngolaUserEntity.create(
			{
				userId: raw.userId,
				role: raw.role as any,
				fullName: raw.fullName,
				phone: raw.phone,
				city: raw.city,
				preferences: raw.preferences,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: LarAngolaUserEntity): any {
		return {
			id: entity.id,
			userId: entity.userId,
			role: entity.role as any,
			fullName: entity.fullName,
			phone: entity.phone as any,
			city: entity.city as any,
			preferences: entity.preferences as any,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		} as any;
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



import { LarAngolaUserEntity } from "../entities/lar-angola-user.entity";

export abstract class ILarAngolaUserRepository {
	abstract create(data: LarAngolaUserEntity): Promise<LarAngolaUserEntity>;
	abstract update(data: LarAngolaUserEntity): Promise<LarAngolaUserEntity>;
	abstract delete(id: string): Promise<void>;
	abstract findById(id: string): Promise<LarAngolaUserEntity | null>;
	abstract findByUserId(userId: string): Promise<LarAngolaUserEntity | null>;
	abstract list(): Promise<LarAngolaUserEntity[]>;
}



import { KimaAppUserEntity } from "../entities";

export abstract class IKimaAppUserRepository {
  abstract create(data: KimaAppUserEntity): Promise<KimaAppUserEntity>;
  abstract list(): Promise<KimaAppUserEntity[]>;
  abstract listDeleted(): Promise<KimaAppUserEntity[]>;
  abstract findById(id: string): Promise<KimaAppUserEntity | null>;
  abstract findByUserId(userId: string): Promise<KimaAppUserEntity | null>;
  abstract findByType(type: string): Promise<KimaAppUserEntity[]>;
  
  abstract update(data: KimaAppUserEntity): Promise<KimaAppUserEntity>;
  abstract delete(id: string): Promise<void>;
  abstract restore(id: string): Promise<KimaAppUserEntity>;
}

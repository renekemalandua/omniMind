import { KimaAppUserEntity } from "../entities";

export abstract class IKimaAppUserRepository {
  abstract create(data: KimaAppUserEntity): Promise<KimaAppUserEntity>;
  abstract list(): Promise<KimaAppUserEntity[]>;
  abstract findById(id: string): Promise<KimaAppUserEntity | null>;
  abstract findByUserId(userId: string): Promise<KimaAppUserEntity | null>;
  abstract findByType(type: HTTP.KimaApp.KimaAppUserType): Promise<KimaAppUserEntity[]>;
  
  abstract update(data: KimaAppUserEntity): Promise<KimaAppUserEntity>;
}

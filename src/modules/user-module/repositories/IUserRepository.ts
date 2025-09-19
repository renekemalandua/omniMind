import { UserEntity } from '../entities';

export abstract class IUserRepository {
  abstract create(data: UserEntity): Promise<UserEntity>;
  abstract list(): Promise<UserEntity[]>;
  abstract listDeleted(): Promise<UserEntity[]>;
  abstract find(email: string, phone: string,): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByPhone(phone: string): Promise<UserEntity | null>;
  abstract findByIdentityNumber(identityNumber: string): Promise<UserEntity | null>;

  abstract delete(id: string): Promise<void>;
  abstract restore(id: string): Promise<UserEntity>;

  abstract verify(id: string): Promise<void>;
  abstract verifyEmail(id: string): Promise<void>;
  abstract verifyIdentity(id: string): Promise<void>;
  abstract activate(id: string): Promise<void>;
  abstract deactivate(id: string): Promise<void>;

  abstract updateEmail(newEmail: string, id: string): Promise<void>;
  abstract updatePhone(newPhone: string, id: string): Promise<void>;
  abstract updatePassword(newPassword: string, id: string): Promise<void>;
  abstract updateIdentityNumber(newIdentityNumber: string, id: string): Promise<void>;
}

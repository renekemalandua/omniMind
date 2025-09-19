import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../IUserRepository';
import { UserEntity } from '../../entities';
import { UserAdapter } from '../../adapter';
import { PrismaService } from '../../../../shared';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: UserEntity): Promise<UserEntity> {
    const raw = UserAdapter.toPrisma(data);
    const user = await this.prisma.user.create({ data: raw });
    return (UserAdapter.toDomain(user));
  }

  async list(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      where:{ deletedAt: null }
    });
    return (users.map((user) => UserAdapter.toDomain(user)));
  }

  async listDeleted(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      where:{
        NOT: { deletedAt: null }
      }
    });
    return (users.map((user) => UserAdapter.toDomain(user)));
  }

  async find(email: string, phone: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });
    if (!user) return null;
    return UserAdapter.toDomain(user);
  }


  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      return null;
    return (UserAdapter.toDomain(user));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      return null;
    return (UserAdapter.toDomain(user));
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user)
      return null;
    return (UserAdapter.toDomain(user));
  }

  async findByIdentityNumber(identityNumber: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { identityNumber } });
    if (!user)
      return null;
    return (UserAdapter.toDomain(user));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        isVerified: false,
        deletedAt: new Date()
      },
    });
  }

  async restore(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        deletedAt: null
      },
    });
    return (UserAdapter.toDomain(user));
  }

  async verify(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isVerified: true, updatedAt: new Date() },
    });
  }

  async verifyEmail(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isEmailVerified: true, updatedAt: new Date() },
    });
  }

  async verifyIdentity(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isIdentityVerified: true, updatedAt: new Date() },
    });
  }

  async activate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: true, updatedAt: new Date() },
    });
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  async updateEmail(newEmail: string, id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { email: newEmail, updatedAt: new Date() },
    });
  }

  async updatePassword(newPassword: string, id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: newPassword, updatedAt: new Date() },
    });
  }

  async updatePhone(newPhone: string, id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { phone: newPhone, updatedAt: new Date() },
    });
  }

  async updateIdentityNumber(newIdentityNumber: string, id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { identityNumber: newIdentityNumber, updatedAt: new Date() },
    });
  }
}

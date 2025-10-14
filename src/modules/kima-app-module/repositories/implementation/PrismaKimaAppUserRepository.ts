import { Injectable } from '@nestjs/common';
import { IKimaAppUserRepository } from '../IKimaAppUserRepository';
import { KimaAppUserEntity } from '../../entities';
import { KimaAppUserAdapter } from '../../adapter';
import { PrismaService } from '../../../../shared';

@Injectable()
export class PrismaKimaAppUserRepository implements IKimaAppUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: KimaAppUserEntity): Promise<KimaAppUserEntity> {
    const raw = KimaAppUserAdapter.toPrisma(data);
    const user = await this.prisma.kimaAppUser.create({ data: raw });
    return KimaAppUserAdapter.toDomain(user);
  }

  async list(): Promise<KimaAppUserEntity[]> {
    const users = await this.prisma.kimaAppUser.findMany();
    return users.map(KimaAppUserAdapter.toDomain);
  }

  async findById(id: string): Promise<KimaAppUserEntity | null> {
    const user = await this.prisma.kimaAppUser.findUnique({ where: { id } });
    return user ? KimaAppUserAdapter.toDomain(user) : null;
  }

  async findByUserId(userId: string): Promise<KimaAppUserEntity | null> {
    const user = await this.prisma.kimaAppUser.findUnique({ where: { userId } });
    return user ? KimaAppUserAdapter.toDomain(user) : null;
  }

  async findByType(type: HTTP.KimaApp.KimaAppUserType): Promise<KimaAppUserEntity[]> {
    const users = await this.prisma.kimaAppUser.findMany({
      where: { type },
      orderBy: { updatedAt: 'desc' },
    });
    return users.map(KimaAppUserAdapter.toDomain);
  }

  async update(data: KimaAppUserEntity): Promise<KimaAppUserEntity> {
    const raw = KimaAppUserAdapter.toPrisma(data);
    const user = await this.prisma.kimaAppUser.update({
      where: { id: data.id },
      data: raw,
    });
    return KimaAppUserAdapter.toDomain(user);
  }
}

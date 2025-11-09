import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../shared';
import { ILarAngolaUserRepository } from '../ILarAngolaUserRepository';
import { LarAngolaUserEntity } from '../../entities/lar-angola-user.entity';
import { LarAngolaUserAdapter } from '../../adapter/lar-angola-user.adapter';

@Injectable()
export class PrismaLarAngolaUserRepository implements ILarAngolaUserRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: LarAngolaUserEntity): Promise<LarAngolaUserEntity> {
		const raw = LarAngolaUserAdapter.toPrisma(data) as any;
		const created = await this.prisma.larAngolaUser.create({ data: raw });
		return LarAngolaUserAdapter.toDomain(created);
	}

	async update(data: LarAngolaUserEntity): Promise<LarAngolaUserEntity> {
		const exists = await this.prisma.larAngolaUser.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('LarAngolaUser not found');
		const raw = LarAngolaUserAdapter.toPrisma(data) as any;
		const updated = await this.prisma.larAngolaUser.update({ where: { id: data.id }, data: raw });
		return LarAngolaUserAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.larAngolaUser.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('LarAngolaUser not found');
		await this.prisma.larAngolaUser.delete({ where: { id } });
	}

	async findById(id: string): Promise<LarAngolaUserEntity | null> {
		const row = await this.prisma.larAngolaUser.findUnique({ where: { id } });
		return row ? LarAngolaUserAdapter.toDomain(row) : null;
	}

	async findByUserId(userId: string): Promise<LarAngolaUserEntity | null> {
		const row = await this.prisma.larAngolaUser.findUnique({ where: { userId } });
		return row ? LarAngolaUserAdapter.toDomain(row) : null;
	}

	async list(): Promise<LarAngolaUserEntity[]> {
		const rows = await this.prisma.larAngolaUser.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(LarAngolaUserAdapter.toDomain);
	}
}



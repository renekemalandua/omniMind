import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../shared';
import { IListingRepository } from '../IListingRepository';
import { ListingEntity } from '../../entities';
import { ListingAdapter } from '../../adapter';

@Injectable()
export class PrismaListingRepository implements IListingRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: ListingEntity): Promise<ListingEntity> {
		const raw = ListingAdapter.toPrisma(data);
		const created = await this.prisma.listingLA.create({ data: raw });
		return ListingAdapter.toDomain(created);
	}

	async list(): Promise<ListingEntity[]> {
		const rows = await this.prisma.listingLA.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(ListingAdapter.toDomain);
	}

	async listByOwner(ownerId: string): Promise<ListingEntity[]> {
		const rows = await this.prisma.listingLA.findMany({ where: { ownerId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ListingAdapter.toDomain);
	}

	async listByProperty(propertyId: string): Promise<ListingEntity[]> {
		const rows = await this.prisma.listingLA.findMany({ where: { propertyId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ListingAdapter.toDomain);
	}

	async findById(id: string): Promise<ListingEntity | null> {
		const row = await this.prisma.listingLA.findUnique({ where: { id } });
		return row ? ListingAdapter.toDomain(row) : null;
	}

	async update(data: ListingEntity): Promise<ListingEntity> {
		const exists = await this.prisma.listingLA.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Listing not found');
		const raw = ListingAdapter.toPrisma(data);
		const updated = await this.prisma.listingLA.update({ where: { id: data.id }, data: raw });
		return ListingAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.listingLA.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Listing not found');
		await this.prisma.listingLA.delete({ where: { id } });
	}
}



import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../shared';
import { IPropertyCategoryRepository } from '../IPropertyCategoryRepository';
import { PropertyCategoryEntity } from '../../entities';
import { PropertyCategoryAdapter } from '../../adapter';

@Injectable()
export class PrismaPropertyCategoryRepository implements IPropertyCategoryRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: PropertyCategoryEntity): Promise<PropertyCategoryEntity> {
		const raw = PropertyCategoryAdapter.toPrisma(data);
		const created = await this.prisma.propertyCategoryLA.create({ data: raw });
		return PropertyCategoryAdapter.toDomain(created);
	}

	async list(): Promise<PropertyCategoryEntity[]> {
		const rows = await this.prisma.propertyCategoryLA.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyCategoryAdapter.toDomain);
	}

	async findById(id: string): Promise<PropertyCategoryEntity | null> {
		const row = await this.prisma.propertyCategoryLA.findUnique({ where: { id } });
		return row ? PropertyCategoryAdapter.toDomain(row) : null;
	}

	async findByName(name: string): Promise<PropertyCategoryEntity | null> {
		const row = await this.prisma.propertyCategoryLA.findFirst({
			where: { name: { equals: name, mode: 'insensitive' } },
		});
		return row ? PropertyCategoryAdapter.toDomain(row) : null;
	}

	async update(data: PropertyCategoryEntity): Promise<PropertyCategoryEntity> {
		const exists = await this.prisma.propertyCategoryLA.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Category not found');
		const raw = PropertyCategoryAdapter.toPrisma(data);
		const updated = await this.prisma.propertyCategoryLA.update({ where: { id: data.id }, data: raw });
		return PropertyCategoryAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.propertyCategoryLA.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Category not found');
		await this.prisma.propertyCategoryLA.delete({ where: { id } });
	}
}

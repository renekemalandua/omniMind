import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductCategoryRepository } from '../IProductCategoryRepository';
import { ProductCategoryEntity } from '../../entities';
import { ProductCategoryAdapter } from '../../adapter';
import { PrismaService } from '../../../../shared';

@Injectable()
export class PrismaProductCategoryRepository implements IProductCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ProductCategoryEntity): Promise<ProductCategoryEntity> {
    const raw = ProductCategoryAdapter.toPrisma(data);
    const category = await this.prisma.productCategory.create({ data: raw });
    return ProductCategoryAdapter.toDomain(category);
  }

  async list(): Promise<ProductCategoryEntity[]> {
    const categories = await this.prisma.productCategory.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return categories.map(ProductCategoryAdapter.toDomain);
  }

  async findById(id: string): Promise<ProductCategoryEntity | null> {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
    });
    return category ? ProductCategoryAdapter.toDomain(category) : null;
  }

  async findByName(name: string): Promise<ProductCategoryEntity | null> {
    const category = await this.prisma.productCategory.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    return category ? ProductCategoryAdapter.toDomain(category) : null;
  }

  async update(data: ProductCategoryEntity): Promise<ProductCategoryEntity> {
    const exists = await this.prisma.productCategory.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Category not found');

    const raw = ProductCategoryAdapter.toPrisma(data);
    const updated = await this.prisma.productCategory.update({
      where: { id: data.id },
      data: raw,
    });
    return ProductCategoryAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.productCategory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Category not found');

    await this.prisma.productCategory.delete({ where: { id } });
  }
}

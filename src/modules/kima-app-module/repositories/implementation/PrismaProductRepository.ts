import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../IProductRepository';
import { ProductEntity } from '../../entities';
import { ProductAdapter } from '../../adapter';
import { PrismaService } from '../../../../shared';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ProductEntity): Promise<ProductEntity> {
    const raw = ProductAdapter.toPrisma(data);
    const product = await this.prisma.product.create({ data: raw });
    return ProductAdapter.toDomain(product);
  }

  async list(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return products.map(ProductAdapter.toDomain);
  }

  async listByOwner(ownerId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { ownerId },
      orderBy: { updatedAt: 'desc' },
    });
    return products.map(ProductAdapter.toDomain);
  }

  async listByCategory(categoryId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      orderBy: { updatedAt: 'desc' },
    });
    return products.map(ProductAdapter.toDomain);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? ProductAdapter.toDomain(product) : null;
  }

  async update(data: ProductEntity): Promise<ProductEntity> {
    const exists = await this.prisma.product.findUnique({ where: { id: data.id } });
    if (!exists) throw new NotFoundException('Product not found');

    const raw = ProductAdapter.toPrisma(data);
    const updated = await this.prisma.product.update({
      where: { id: data.id },
      data: raw,
    });
    return ProductAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id } });
  }
}

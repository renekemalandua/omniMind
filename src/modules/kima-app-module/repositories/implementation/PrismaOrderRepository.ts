import { Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '../IOrderRepository';
import { OrderEntity } from '../../entities';
import { OrderAdapter } from '../../adapter';
import { PrismaService } from '../../../../shared';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: OrderEntity): Promise<OrderEntity> {
    const raw = OrderAdapter.toPrisma(data);
    const order = await this.prisma.order.create({ data: raw });
    return OrderAdapter.toDomain(order);
  }

  async list(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(OrderAdapter.toDomain);
  }

  async listByBuyer(buyerId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(OrderAdapter.toDomain);
  }

  async listByDriver(driverId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(OrderAdapter.toDomain);
  }

  async listByProduct(productId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(OrderAdapter.toDomain);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    return order ? OrderAdapter.toDomain(order) : null;
  }

  async update(data: OrderEntity): Promise<OrderEntity> {
    const exists = await this.prisma.order.findUnique({ where: { id: data.id } });
    if (!exists) throw new NotFoundException('Order not found');

    const raw = OrderAdapter.toPrisma(data);
    const updated = await this.prisma.order.update({
      where: { id: data.id },
      data: raw,
    });
    return OrderAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.order.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Order not found');

    await this.prisma.order.delete({ where: { id } });
  }
}

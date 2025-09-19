import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IOrderRepository, IProductRepository, IKimaAppUserRepository } from '../repositories';
import { OrderEntity } from '../entities';
import { CreateOrderRequestDTO, UpdateOrderRequestDTO } from '../dto';

@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderRequestDTO, OrderEntity> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly userRepository: IKimaAppUserRepository,
  ) {}

  async execute(request: CreateOrderRequestDTO): Promise<OrderEntity> {
    const buyer = await this.userRepository.findById(request.buyerId);
    if (!buyer) throw new BadRequestException('Buyer not found');

    const product = await this.productRepository.findById(request.productId);
    if (!product) throw new BadRequestException('Product not found');

    if (request.driverId) {
      const driver = await this.userRepository.findById(request.driverId);
      if (!driver) throw new BadRequestException('Driver not found');
    }

    const order = OrderEntity.create(request);
    return this.orderRepository.create(order);
  }
}

@Injectable()
export class UpdateOrderUseCase implements UseCase<{ id: string; data: UpdateOrderRequestDTO }, OrderEntity> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userRepository: IKimaAppUserRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute({ id, data }: { id: string; data: UpdateOrderRequestDTO }): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new BadRequestException('Order not found');

    if (data.driverId !== undefined) {
      if (data.driverId !== null) {
        const driver = await this.userRepository.findById(data.driverId);
        if (!driver) throw new BadRequestException('Driver not found');
      }
      order.driverId = data.driverId;
    }

    if (data.status) {
      order.status = data.status as OrderEntity['status'];
    }

    return this.orderRepository.update(order);
  }
}

@Injectable()
export class DeleteOrderUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new BadRequestException('Order not found');
    await this.repository.delete(id);
  }
}

@Injectable()
export class ListOrdersUseCase implements UseCase<void, OrderEntity[]> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(): Promise<OrderEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class ListOrdersByBuyerUseCase implements UseCase<string, OrderEntity[]> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(buyerId: string): Promise<OrderEntity[]> {
    return this.repository.listByBuyer(buyerId);
  }
}

@Injectable()
export class ListOrdersByDriverUseCase implements UseCase<string, OrderEntity[]> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(driverId: string): Promise<OrderEntity[]> {
    return this.repository.listByDriver(driverId);
  }
}

@Injectable()
export class ListOrdersByProductUseCase implements UseCase<string, OrderEntity[]> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(productId: string): Promise<OrderEntity[]> {
    return this.repository.listByProduct(productId);
  }
}

@Injectable()
export class FindOrderByIdUseCase implements UseCase<string, OrderEntity> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(id: string): Promise<OrderEntity> {
    const order = await this.repository.findById(id);
    if (!order) throw new BadRequestException('Order not found');
    return order;
  }
}

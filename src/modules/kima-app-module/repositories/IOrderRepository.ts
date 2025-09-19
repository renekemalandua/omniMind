import { OrderEntity } from "../entities";

export abstract class IOrderRepository {
  abstract create(data: OrderEntity): Promise<OrderEntity>;
  abstract list(): Promise<OrderEntity[]>;
  abstract listByBuyer(buyerId: string): Promise<OrderEntity[]>;
  abstract listByDriver(driverId: string): Promise<OrderEntity[]>;
  abstract listByProduct(productId: string): Promise<OrderEntity[]>;

  abstract findById(id: string): Promise<OrderEntity | null>;

  abstract update(data: OrderEntity): Promise<OrderEntity>;
  abstract delete(id: string): Promise<void>;
}

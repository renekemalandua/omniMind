import { ProductEntity } from "../entities";

export abstract class IProductRepository {
  abstract create(data: ProductEntity): Promise<ProductEntity>;
  abstract list(): Promise<ProductEntity[]>;
  abstract listByOwner(ownerId: string): Promise<ProductEntity[]>;
  abstract listByCategory(categoryId: string): Promise<ProductEntity[]>;

  abstract findById(id: string): Promise<ProductEntity | null>;

  abstract update(data: ProductEntity): Promise<ProductEntity>;
  abstract delete(id: string): Promise<void>;
}

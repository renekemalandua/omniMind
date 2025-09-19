import { ProductCategoryEntity } from "../entities";

export abstract class IProductCategoryRepository {
  abstract create(data: ProductCategoryEntity): Promise<ProductCategoryEntity>;
  abstract list(): Promise<ProductCategoryEntity[]>;
  abstract findById(id: string): Promise<ProductCategoryEntity | null>;
  abstract findByName(name: string): Promise<ProductCategoryEntity | null>;

  abstract update(data: ProductCategoryEntity): Promise<ProductCategoryEntity>;
  abstract delete(id: string): Promise<void>;
}

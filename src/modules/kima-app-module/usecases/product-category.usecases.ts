import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IProductCategoryRepository } from '../repositories';
import { ProductCategoryEntity } from '../entities';
import { CreateProductCategoryRequestDTO, UpdateProductCategoryRequestDTO } from '../dto';

@Injectable()
export class CreateProductCategoryUseCase implements UseCase<CreateProductCategoryRequestDTO, ProductCategoryEntity> {
  constructor(private readonly repository: IProductCategoryRepository) {}

  async execute(request: CreateProductCategoryRequestDTO): Promise<ProductCategoryEntity> {
    const existingCategory = await this.repository.findByName(request.name);
    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = ProductCategoryEntity.create(request);
    return this.repository.create(category);
  }
}

@Injectable()
export class UpdateProductCategoryUseCase implements UseCase<{ id: string; data: UpdateProductCategoryRequestDTO }, ProductCategoryEntity> {
  constructor(private readonly repository: IProductCategoryRepository) {}

  async execute({ id, data }: { id: string; data: UpdateProductCategoryRequestDTO }): Promise<ProductCategoryEntity> {
    const category = await this.repository.findById(id);
    if (!category) throw new BadRequestException('Category not found');

    if (data.name) {
      const otherCategory = await this.repository.findByName(data.name);
      if (otherCategory && otherCategory.id !== id) {
        throw new BadRequestException('Another category with this name already exists');
      }
      category.name = data.name;
    }

    if (data.description !== undefined) {
      category.description = data.description;
    }

    return this.repository.update(category);
  }
}

@Injectable()
export class DeleteProductCategoryUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IProductCategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    await this.repository.delete(id);
  }
}

@Injectable()
export class ListProductCategoriesUseCase implements UseCase<void, ProductCategoryEntity[]> {
  constructor(private readonly repository: IProductCategoryRepository) {}

  async execute(): Promise<ProductCategoryEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class FindProductCategoryByIdUseCase implements UseCase<string, ProductCategoryEntity> {
  constructor(private readonly repository: IProductCategoryRepository) {}

  async execute(id: string): Promise<ProductCategoryEntity> {
    const category = await this.repository.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    return category;
  }
}

@Injectable()
export class FindProductCategoryByNameUseCase implements UseCase<string, ProductCategoryEntity> {
  constructor(private readonly repository: IProductCategoryRepository) {}

  async execute(name: string): Promise<ProductCategoryEntity> {
    const category = await this.repository.findByName(name);
    if (!category) throw new BadRequestException('Category not found');
    return category;
  }
}

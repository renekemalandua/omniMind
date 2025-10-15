import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IProductRepository, IProductCategoryRepository } from '../repositories';
import { ProductEntity } from '../entities';
import { CreateProductRequestDTO, UpdateProductRequestDTO } from '../dto';

@Injectable()
export class CreateProductUseCase implements UseCase<CreateProductRequestDTO, ProductEntity> {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly categoryRepository: IProductCategoryRepository,
    ) { }

    async execute(request: CreateProductRequestDTO): Promise<ProductEntity> {
        const existingProducts = await this.productRepository.listByOwner(request.ownerId);
        if (existingProducts.some(p => p.name?.toLowerCase() === request.name.toLowerCase())) {
            throw new BadRequestException('Product with this name already exists');
        }
        const categoryExists = await this.categoryRepository.findById(request.categoryId);
        if (!categoryExists) {
            throw new BadRequestException('Category does not exist');
        }
        const product = ProductEntity.create(request);
        return this.productRepository.create(product);
    }
}

@Injectable()
export class UpdateProductUseCase implements UseCase<{ id: string; data: UpdateProductRequestDTO }, ProductEntity> {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute({ id, data }: { id: string; data: UpdateProductRequestDTO }): Promise<ProductEntity> {
        const product = await this.productRepository.findById(id);
        if (!product) throw new BadRequestException('Product not found');

        if (data.name !== undefined && data.name !== null) {
            const otherProducts = await this.productRepository.listByOwner(product.ownerId);
            if (otherProducts.some(p => p.id !== id && p.name?.toLowerCase() === data.name!.toLowerCase())) {
                throw new BadRequestException('Another product with this name already exists');
            }
            product.name = data.name!;
        }
        if (data.price !== undefined) product.price = data.price;
        if (data.quantity !== undefined) product.quantity = data.quantity;
        if (data.description !== undefined) product.description = data.description;

        return this.productRepository.update(product);
    }
}

@Injectable()
export class DeleteProductUseCase implements UseCase<string, void> {
    constructor(private readonly repository: IProductRepository) { }

    async execute(id: string): Promise<void> {
        const product = await this.repository.findById(id);
        if (!product) throw new BadRequestException('Product not found');
        await this.repository.delete(id);
    }
}

@Injectable()
export class ListProductsUseCase implements UseCase<void, ProductEntity[]> {
    constructor(private readonly repository: IProductRepository) { }
    async execute(): Promise<ProductEntity[]> {
        return this.repository.list();
    }
}

@Injectable()
export class ListProductsByOwnerUseCase implements UseCase<string, ProductEntity[]> {
    constructor(private readonly repository: IProductRepository) { }

    async execute(ownerId: string): Promise<ProductEntity[]> {
        const products = await this.repository.listByOwner(ownerId);
        if (!products || products.length === 0) {
            throw new BadRequestException('Owner not found or has no products');
        }
        return products;
    }
}

@Injectable()
export class ListProductsByCategoryUseCase implements UseCase<string, ProductEntity[]> {
    constructor(
        private readonly repository: IProductRepository,
        private readonly categoryRepository: IProductCategoryRepository,
    ) { }

    async execute(categoryId: string): Promise<ProductEntity[]> {
        const categoryExists = await this.categoryRepository.findById(categoryId);
        if (!categoryExists) {
            throw new BadRequestException('Category does not exist');
        }

        return this.repository.listByCategory(categoryId);
    }
}

@Injectable()
export class FindProductByIdUseCase implements UseCase<string, ProductEntity | null> {
	constructor(private readonly repository: IProductRepository) { }

	async execute(id: string): Promise<ProductEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Product not found');
		return entity;
	}
}

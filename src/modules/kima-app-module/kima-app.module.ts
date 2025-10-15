import { Module } from '@nestjs/common';
import { UserModule } from '../user-module';
import {
	CreateKimaAppUserUseCase,
	ListKimaAppUsersUseCase,
	FindKimaAppUserByIdUseCase,
	UpdateKimaAppUserUseCase,
	CreateOrderUseCase,
	UpdateOrderUseCase,
	DeleteOrderUseCase,
	ListOrdersUseCase,
	ListOrdersByBuyerUseCase,
	ListOrdersByDriverUseCase,
	ListOrdersByProductUseCase,
	FindOrderByIdUseCase,
	CreateProductCategoryUseCase,
	UpdateProductCategoryUseCase,
	DeleteProductCategoryUseCase,
	ListProductCategoriesUseCase,
	FindProductCategoryByIdUseCase,
	CreateProductUseCase,
	UpdateProductUseCase,
	DeleteProductUseCase,
	ListProductsUseCase,
	ListProductsByOwnerUseCase,
	ListProductsByCategoryUseCase,
	FindProductByIdUseCase,
} from './usecases';
import {
	KimaAppUserController,
	ProductController,
	OrderController,
	ProductCategoryController,
} from './controllers';
import {
	IKimaAppUserRepository, PrismaKimaAppUserRepository,
	IProductRepository, PrismaProductRepository,
	IOrderRepository, PrismaOrderRepository,
	IProductCategoryRepository, PrismaProductCategoryRepository,
} from './repositories';
import { ProviderModule } from '../../shared';
import { HttpBuilder } from './utils';


@Module({
	imports: [UserModule, ProviderModule],
	controllers: [
		KimaAppUserController,
		ProductController,
		OrderController,
		ProductCategoryController,
	],
	providers: [
		// Repositories
		{ provide: IKimaAppUserRepository, useClass: PrismaKimaAppUserRepository },
		{ provide: IProductRepository, useClass: PrismaProductRepository },
		{ provide: IOrderRepository, useClass: PrismaOrderRepository },
		{ provide: IProductCategoryRepository, useClass: PrismaProductCategoryRepository },

		HttpBuilder,

		// KimaApp Users
		CreateKimaAppUserUseCase,
		ListKimaAppUsersUseCase,
		FindKimaAppUserByIdUseCase,
		UpdateKimaAppUserUseCase,

		// Orders
		CreateOrderUseCase,
		UpdateOrderUseCase,
		DeleteOrderUseCase,
		ListOrdersUseCase,
		ListOrdersByBuyerUseCase,
		ListOrdersByDriverUseCase,
		ListOrdersByProductUseCase,
		FindOrderByIdUseCase,

		// Product Categories
		CreateProductCategoryUseCase,
		UpdateProductCategoryUseCase,
		DeleteProductCategoryUseCase,
		ListProductCategoriesUseCase,
		FindProductCategoryByIdUseCase,

		// Products
		CreateProductUseCase,
		UpdateProductUseCase,
		DeleteProductUseCase,
		ListProductsUseCase,
		ListProductsByOwnerUseCase,
		ListProductsByCategoryUseCase,
		FindProductByIdUseCase,

	],
	exports: [
		FindKimaAppUserByIdUseCase,
		FindProductByIdUseCase,
		HttpBuilder
	],
})
export class KimaAppModule {}

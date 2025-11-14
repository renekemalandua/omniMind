import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
	CreateKimaAppUserUseCase,
	ListKimaAppUsersUseCase,
	FindKimaAppUserByIdUseCase,
	UpdateKimaAppUserUseCase,
	CreateProductUseCase,
	UpdateProductUseCase,
	DeleteProductUseCase,
	ListProductsUseCase,
	ListProductsByOwnerUseCase,
	ListProductsByCategoryUseCase,
	FindProductByIdUseCase,
	CreateProductCategoryUseCase,
	UpdateProductCategoryUseCase,
	DeleteProductCategoryUseCase,
	ListProductCategoriesUseCase,
	FindProductCategoryByIdUseCase,
	CreateOrderUseCase,
	UpdateOrderUseCase,
	DeleteOrderUseCase,
	ListOrdersUseCase,
	ListOrdersByBuyerUseCase,
	ListOrdersByDriverUseCase,
	ListOrdersByProductUseCase,
	FindOrderByIdUseCase,
} from '../../modules/kima-app-module/usecases';
import { FindUserByIdUseCase } from '../../modules/user-module/usecases';
import {
	KimaAppUserEntity,
	ProductCategoryEntity,
	ProductEntity,
	OrderEntity,
} from '../../modules/kima-app-module/entities';
import {
	KimaAppUserAdapter,
	ProductCategoryAdapter,
	ProductAdapter,
	OrderAdapter,
} from '../../modules/kima-app-module/adapter';
import { UserAdapter } from '../../modules/user-module/adapter';
import { UserEntity } from '../../modules/user-module/entities';
import { GLOBAL_CONFIG, IdValueObject } from '../../shared';
import { HttpBuilder } from '../../modules/kima-app-module/utils';
import { closeApp, initTestApp, serializeDates } from './test-utils';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');
const API_PREFIX = '/api/v1';

jest.setTimeout(20000);

const createUserEntity = (id: string, email: string) =>
	UserEntity.create(
		{
			email,
			phone: '+244900000000',
			identityNumber: 'ID123456',
			password: 'hashed-password',
			isActive: true,
			isVerified: true,
			isEmailVerified: true,
			isIdentityVerified: true,
			createdAt: FIXED_DATE,
			updatedAt: FIXED_DATE,
			deletedAt: null,
		},
		new IdValueObject(id),
	);

const farmerUser = createUserEntity('user-farmer', 'farmer@example.com');
const companyUser = createUserEntity('user-company', 'company@example.com');
const sellerUser = createUserEntity('user-seller', 'seller@example.com');
const driverUser = createUserEntity('user-driver', 'driver@example.com');

const farmerKima = KimaAppUserEntity.create(
	{
		userId: farmerUser.id,
		type: 'farmer',
		name: 'Farm Owner',
		farmSize: 10,
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('kima-farmer'),
);

const companyKima = KimaAppUserEntity.create(
	{
		userId: companyUser.id,
		type: 'company',
		name: 'Buyer Company',
		companyType: 'Retail',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('kima-company'),
);

const sellerKima = KimaAppUserEntity.create(
	{
		userId: sellerUser.id,
		type: 'seller',
		name: 'Seller Partner',
		productsCarried: 'Vegetables',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('kima-seller'),
);

const driverKima = KimaAppUserEntity.create(
	{
		userId: driverUser.id,
		type: 'driver',
		name: 'Delivery Driver',
		vehicleType: 'Truck',
		licenseNumber: 'DRV-123',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('kima-driver'),
);

const categoryEntity = ProductCategoryEntity.create(
	{
		name: 'Fresh Produce',
		description: 'All farm goods',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('category-1'),
);

const productEntity = ProductEntity.create(
	{
		ownerId: farmerKima.id,
		categoryId: categoryEntity.id,
		name: 'Corn',
		description: 'Fresh corn',
		price: 50,
		quantity: 20,
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('product-1'),
);

const orderEntity = OrderEntity.create(
	{
		productId: productEntity.id,
		buyerId: companyKima.id,
		driverId: driverKima.id,
		status: 'pending',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('order-1'),
);

const userHttpMap = new Map<string, HTTP.User.UserDetail>([
	[farmerUser.id, UserAdapter.toHttp(farmerUser)],
	[companyUser.id, UserAdapter.toHttp(companyUser)],
	[sellerUser.id, UserAdapter.toHttp(sellerUser)],
	[driverUser.id, UserAdapter.toHttp(driverUser)],
]);

const kimaHttpMap = new Map<string, HTTP.KimaApp.FarmerUserResponse | HTTP.KimaApp.CompanyUserResponse | HTTP.KimaApp.DriverUserResponse | HTTP.KimaApp.SellerUserResponse>([
	[farmerKima.id, KimaAppUserAdapter.toHttp(farmerKima, userHttpMap.get(farmerUser.id)!)],
	[companyKima.id, KimaAppUserAdapter.toHttp(companyKima, userHttpMap.get(companyUser.id)!)],
	[sellerKima.id, KimaAppUserAdapter.toHttp(sellerKima, userHttpMap.get(sellerUser.id)!)],
	[driverKima.id, KimaAppUserAdapter.toHttp(driverKima, userHttpMap.get(driverUser.id)!)],
]);

const categoryHttp = ProductCategoryAdapter.toHttp(categoryEntity);
const productHttp = ProductAdapter.toHttp(
	productEntity,
	kimaHttpMap.get(farmerKima.id)! as HTTP.KimaApp.FarmerUserResponse,
	{ ...categoryHttp, products: [] },
);

const orderHttp = OrderAdapter.toHttp(
	orderEntity,
	productHttp,
	kimaHttpMap.get(companyKima.id)! as HTTP.KimaApp.CompanyUserResponse,
	kimaHttpMap.get(driverKima.id)! as HTTP.KimaApp.DriverUserResponse,
);

describe('Kima App Module E2E', () => {
	let app: INestApplication | undefined;

	beforeAll(() => {
		GLOBAL_CONFIG.jwtVerifyExp = '3600';
		GLOBAL_CONFIG.jwtVerifySecret = 'verify-secret';
		GLOBAL_CONFIG.jwtAuthExp = '3600';
		GLOBAL_CONFIG.jwtAuthSecret = 'auth-secret';
	});

	afterEach(async () => {
		await closeApp(app);
		app = undefined;
	});

	const userFinderMock = {
		execute: jest.fn((id: string) => Promise.resolve({
			[farmerUser.id]: farmerUser,
			[companyUser.id]: companyUser,
			[sellerUser.id]: sellerUser,
			[driverUser.id]: driverUser,
		}[id] ?? null)),
	};

	const kimaFinderMock = {
		execute: jest.fn((id: string) => Promise.resolve({
			[farmerKima.id]: farmerKima,
			[companyKima.id]: companyKima,
			[sellerKima.id]: sellerKima,
			[driverKima.id]: driverKima,
		}[id] ?? null)),
	};

	const httpBuilderMock = {
		buildProduct: jest.fn().mockResolvedValue(productHttp),
		buildOrder: jest.fn().mockResolvedValue(orderHttp),
	};

	const baseOverrides = [
		{ provide: FindUserByIdUseCase, useValue: userFinderMock },
		{ provide: FindKimaAppUserByIdUseCase, useValue: kimaFinderMock },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		httpBuilderMock.buildProduct.mockResolvedValue(productHttp);
		httpBuilderMock.buildOrder.mockResolvedValue(orderHttp);
	});

	describe('Kima App User Controller', () => {
		it('POST /kima-app/user/create should create a Kima user', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(farmerKima) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: CreateKimaAppUserUseCase, useValue: createMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/kima-app/user/create`)
				.send({ userId: farmerUser.id, type: 'farmer', name: 'Farm Owner' })
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(kimaHttpMap.get(farmerKima.id)),
			});
		});

		it('GET /kima-app/user/list should list users', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([farmerKima, companyKima]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListKimaAppUsersUseCase, useValue: listMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/user/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([
					kimaHttpMap.get(farmerKima.id),
					kimaHttpMap.get(companyKima.id),
				]),
			});
		});

		it('GET /kima-app/user/:id should return user', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(farmerKima) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: FindKimaAppUserByIdUseCase, useValue: findMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/user/${farmerKima.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(kimaHttpMap.get(farmerKima.id)),
			});
		});

		it('PUT /kima-app/user/:id should update user', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(companyKima) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: UpdateKimaAppUserUseCase, useValue: updateMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/kima-app/user/${companyKima.id}`)
				.send({ name: 'Updated Company' })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(kimaHttpMap.get(companyKima.id)),
			});
		});
	});

	describe('Product Category Controller', () => {
		it('POST /kima-app/product-categories/create should create category', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(categoryEntity) };

			app = await initTestApp([
				{ provide: CreateProductCategoryUseCase, useValue: createMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/kima-app/product-categories/create`)
				.send({ name: 'Fresh Produce' })
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(categoryHttp),
			});
		});

		it('GET /kima-app/product-categories/list should list categories', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([categoryEntity]) };

			app = await initTestApp([
				{ provide: ListProductCategoriesUseCase, useValue: listMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/product-categories/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([categoryHttp]),
			});
		});

		it('GET /kima-app/product-categories/:id should return category', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(categoryEntity) };

			app = await initTestApp([
				{ provide: FindProductCategoryByIdUseCase, useValue: findMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/product-categories/${categoryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(categoryHttp),
			});
		});

		it('PUT /kima-app/product-categories/:id should update category', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(categoryEntity) };

			app = await initTestApp([
				{ provide: UpdateProductCategoryUseCase, useValue: updateMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/kima-app/product-categories/${categoryEntity.id}`)
				.send({ description: 'Updated' })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(categoryHttp),
			});
		});

		it('DELETE /kima-app/product-categories/:id should delete category', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeleteProductCategoryUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/kima-app/product-categories/${categoryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Category deleted successfully' },
			});
		});
	});

	describe('Product Controller', () => {
		it('POST /kima-app/products/create should create product', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(productEntity) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: CreateProductUseCase, useValue: createMock },
				{ provide: FindProductByIdUseCase, useValue: { execute: jest.fn() } },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/kima-app/products/create`)
				.send({
					ownerId: farmerKima.id,
					categoryId: categoryEntity.id,
					name: 'Corn',
					price: 50,
					quantity: 20,
				})
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(productHttp),
			});
		});

		it('GET /kima-app/products/list should list products', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([productEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListProductsUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/products/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([productHttp]),
			});
		});

		it('GET /kima-app/products/:id should return product', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(productEntity) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: FindProductByIdUseCase, useValue: findMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/products/${productEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(productHttp),
			});
		});

		it('GET /kima-app/products/owner/:ownerId should list by owner', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([productEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListProductsByOwnerUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/products/owner/${farmerKima.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([productHttp]),
			});
		});

		it('GET /kima-app/products/category/:categoryId should list by category', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([productEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListProductsByCategoryUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/products/category/${categoryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([productHttp]),
			});
		});

		it('PUT /kima-app/products/:id should update product', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(productEntity) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: UpdateProductUseCase, useValue: updateMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/kima-app/products/${productEntity.id}`)
				.send({ price: 60 })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(productHttp),
			});
		});

		it('DELETE /kima-app/products/:id should delete product', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeleteProductUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/kima-app/products/${productEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Product deleted successfully' },
			});
		});
	});

	describe('Order Controller', () => {
		it('POST /kima-app/orders/create should create order', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(orderEntity) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: CreateOrderUseCase, useValue: createMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/kima-app/orders/create`)
				.send({
					productId: productEntity.id,
					buyerId: companyKima.id,
					driverId: driverKima.id,
				})
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(orderHttp),
			});
		});

		it('GET /kima-app/orders/list should list orders', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([orderEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListOrdersUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/orders/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([orderHttp]),
			});
		});

		it('GET /kima-app/orders/:id should return order', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(orderEntity) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: FindOrderByIdUseCase, useValue: findMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/orders/${orderEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(orderHttp),
			});
		});

		it('GET /kima-app/orders/buyer/:buyerId should list by buyer', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([orderEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListOrdersByBuyerUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/orders/buyer/${companyKima.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([orderHttp]),
			});
		});

		it('GET /kima-app/orders/driver/:driverId should list by driver', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([orderEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListOrdersByDriverUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/orders/driver/${driverKima.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([orderHttp]),
			});
		});

		it('GET /kima-app/orders/product/:productId should list by product', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([orderEntity]) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: ListOrdersByProductUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/kima-app/orders/product/${productEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([orderHttp]),
			});
		});

		it('PUT /kima-app/orders/:id should update order', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(orderEntity) };

			app = await initTestApp([
				...baseOverrides,
				{ provide: UpdateOrderUseCase, useValue: updateMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/kima-app/orders/${orderEntity.id}`)
				.send({ status: 'delivered' })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(orderHttp),
			});
		});

		it('DELETE /kima-app/orders/:id should delete order', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeleteOrderUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/kima-app/orders/${orderEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Order deleted successfully' },
			});
		});
	});
});


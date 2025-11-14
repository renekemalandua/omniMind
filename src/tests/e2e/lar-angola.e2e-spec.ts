import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
	CreatePropertyCategoryUseCase,
	ListPropertyCategoriesUseCase,
	FindPropertyCategoryByIdUseCase,
	UpdatePropertyCategoryUseCase,
	DeletePropertyCategoryUseCase,
	CreatePropertyUseCase,
	ListPropertiesUseCase,
	ListPropertiesByOwnerUseCase,
	ListPropertiesByCategoryUseCase,
	FindPropertyByIdUseCase,
	UpdatePropertyUseCase,
	DeletePropertyUseCase,
	CreateListingUseCase,
	ListListingsUseCase,
	ListListingsByOwnerUseCase,
	ListListingsByPropertyUseCase,
	FindListingByIdUseCase,
	UpdateListingUseCase,
	DeleteListingUseCase,
	CreateInquiryUseCase,
	ListInquiriesByListingUseCase,
	FindInquiryByIdUseCase,
	DeleteInquiryUseCase,
	CreateLarAngolaUserUseCase,
	ListLarAngolaUsersUseCase,
	FindLarAngolaUserByIdUseCase,
	UpdateLarAngolaUserUseCase,
	DeleteLarAngolaUserUseCase,
} from '../../modules/lar-angola-module/usecases';
import {
	LarAngolaUserEntity,
	PropertyCategoryEntity,
	PropertyEntity,
	ListingEntity,
	InquiryEntity,
} from '../../modules/lar-angola-module/entities';
import {
	LarAngolaUserAdapter,
	PropertyCategoryAdapter,
	PropertyAdapter,
	ListingAdapter,
	InquiryAdapter,
} from '../../modules/lar-angola-module/adapter';
import { HttpBuilder } from '../../modules/lar-angola-module/utils';
import { GLOBAL_CONFIG, IdValueObject } from '../../shared';
import { closeApp, initTestApp, serializeDates } from './test-utils';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');
const API_PREFIX = '/api/v1';

jest.setTimeout(20000);

const larUserEntity = LarAngolaUserEntity.create(
	{
		userId: 'user-1',
		role: 'client',
		fullName: 'Maria Silva',
		phone: '+244900000001',
		city: 'Luanda',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('lar-user-1'),
);

const larUserHttp = LarAngolaUserAdapter.toHttp(larUserEntity);

const larCategoryEntity = PropertyCategoryEntity.create(
	{
		name: 'Apartments',
		description: 'Residential apartments',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('lar-category-1'),
);

const larCategoryHttp = PropertyCategoryAdapter.toHttp(larCategoryEntity);

const larPropertyEntity = PropertyEntity.create(
	{
		ownerId: larUserEntity.id,
		categoryId: larCategoryEntity.id,
		title: 'Modern Apartment',
		description: '2 bedroom apartment',
		address: 'Rua 1',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		bedrooms: 2,
		bathrooms: 2,
		areaSqm: 120,
		amenities: ['pool'],
		images: ['image.jpg'],
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('lar-property-1'),
);

const larPropertyHttp = PropertyAdapter.toHttp(
	larPropertyEntity,
	larUserHttp,
	{ ...larCategoryHttp, properties: [] } as unknown as HTTP.LarAngola.PropertyCategoryResponse,
);

const larListingEntity = ListingEntity.create(
	{
		propertyId: larPropertyEntity.id,
		ownerId: larUserEntity.id,
		transactionType: 'rent',
		price: 1000,
		currency: 'AOA',
		status: 'active',
		createdAt: FIXED_DATE,
		updatedAt: FIXED_DATE,
	},
	new IdValueObject('lar-listing-1'),
);

const larListingHttp = ListingAdapter.toHttp(
	larListingEntity,
	larPropertyHttp,
	larUserHttp,
);

const larInquiryEntity = InquiryEntity.create(
	{
		listingId: larListingEntity.id,
		userId: larUserEntity.id,
		name: 'Inquiry Person',
		email: 'inquiry@example.com',
		phone: '+244930000001',
		message: 'Interested in listing',
		createdAt: FIXED_DATE,
	},
	new IdValueObject('lar-inquiry-1'),
);

const larInquiryHttp = InquiryAdapter.toHttp(
	larInquiryEntity,
	{ id: larListingEntity.id } as any,
	larUserHttp,
);

describe('Lar Angola Module E2E', () => {
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

	const httpBuilderMock = {
		buildProperty: jest.fn().mockResolvedValue(larPropertyHttp),
		buildListing: jest.fn().mockResolvedValue(larListingHttp),
		buildInquiry: jest.fn().mockResolvedValue(larInquiryHttp),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		httpBuilderMock.buildProperty.mockResolvedValue(larPropertyHttp);
		httpBuilderMock.buildListing.mockResolvedValue(larListingHttp);
		httpBuilderMock.buildInquiry.mockResolvedValue(larInquiryHttp);
	});

	describe('LarAngola User Controller', () => {
		it('POST /lar-angola/users/create should create user', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(larUserEntity) };

			app = await initTestApp([
				{ provide: CreateLarAngolaUserUseCase, useValue: createMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/lar-angola/users/create`)
				.send({ userId: 'user-1', role: 'client', fullName: 'Maria Silva' })
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larUserHttp),
			});
		});

		it('PUT /lar-angola/users/:id should update user', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(larUserEntity) };

			app = await initTestApp([
				{ provide: UpdateLarAngolaUserUseCase, useValue: updateMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/lar-angola/users/${larUserEntity.id}`)
				.send({ fullName: 'Updated Name' })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larUserHttp),
			});
		});

		it('GET /lar-angola/users/:id should return user', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(larUserEntity) };

			app = await initTestApp([
				{ provide: FindLarAngolaUserByIdUseCase, useValue: findMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/users/${larUserEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larUserHttp),
			});
		});

		it('GET /lar-angola/users should list users', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larUserEntity]) };

			app = await initTestApp([
				{ provide: ListLarAngolaUsersUseCase, useValue: listMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/users`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larUserHttp]),
			});
		});

		it('DELETE /lar-angola/users/:id should delete user', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeleteLarAngolaUserUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/lar-angola/users/${larUserEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'LarAngola user deleted successfully' },
			});
		});
	});

	describe('Property Category Controller', () => {
		it('POST /lar-angola/categories/create should create category', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(larCategoryEntity) };

			app = await initTestApp([
				{ provide: CreatePropertyCategoryUseCase, useValue: createMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/lar-angola/categories/create`)
				.send({ name: 'Apartments' })
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larCategoryHttp),
			});
		});

		it('GET /lar-angola/categories/list should list categories', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larCategoryEntity]) };

			app = await initTestApp([
				{ provide: ListPropertyCategoriesUseCase, useValue: listMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/categories/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larCategoryHttp]),
			});
		});

		it('GET /lar-angola/categories/:id should return category', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(larCategoryEntity) };

			app = await initTestApp([
				{ provide: FindPropertyCategoryByIdUseCase, useValue: findMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/categories/${larCategoryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larCategoryHttp),
			});
		});

		it('PUT /lar-angola/categories/:id should update category', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(larCategoryEntity) };

			app = await initTestApp([
				{ provide: UpdatePropertyCategoryUseCase, useValue: updateMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/lar-angola/categories/${larCategoryEntity.id}`)
				.send({ description: 'Updated' })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larCategoryHttp),
			});
		});

		it('DELETE /lar-angola/categories/:id should delete category', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeletePropertyCategoryUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/lar-angola/categories/${larCategoryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Category deleted successfully' },
			});
		});
	});

	describe('Property Controller', () => {
		it('POST /lar-angola/properties/create should create property', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(larPropertyEntity) };

			app = await initTestApp([
				{ provide: CreatePropertyUseCase, useValue: createMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/lar-angola/properties/create`)
				.send({
					ownerId: larUserEntity.id,
					categoryId: larCategoryEntity.id,
					title: 'Modern Apartment',
					price: 1000,
				})
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larPropertyHttp),
			});
		});

		it('GET /lar-angola/properties/list should list properties', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larPropertyEntity]) };

			app = await initTestApp([
				{ provide: ListPropertiesUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/properties/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larPropertyHttp]),
			});
		});

		it('GET /lar-angola/properties/:id should return property', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(larPropertyEntity) };

			app = await initTestApp([
				{ provide: FindPropertyByIdUseCase, useValue: findMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/properties/${larPropertyEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larPropertyHttp),
			});
		});

		it('GET /lar-angola/properties/owner/:ownerId should list by owner', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larPropertyEntity]) };

			app = await initTestApp([
				{ provide: ListPropertiesByOwnerUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/properties/owner/${larUserEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larPropertyHttp]),
			});
		});

		it('GET /lar-angola/properties/category/:categoryId should list by category', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larPropertyEntity]) };

			app = await initTestApp([
				{ provide: ListPropertiesByCategoryUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/properties/category/${larCategoryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larPropertyHttp]),
			});
		});

		it('PUT /lar-angola/properties/:id should update property', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(larPropertyEntity) };

			app = await initTestApp([
				{ provide: UpdatePropertyUseCase, useValue: updateMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/lar-angola/properties/${larPropertyEntity.id}`)
				.send({ title: 'Updated Title' })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larPropertyHttp),
			});
		});

		it('DELETE /lar-angola/properties/:id should delete property', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeletePropertyUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/lar-angola/properties/${larPropertyEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Property deleted successfully' },
			});
		});
	});

	describe('Listing Controller', () => {
		it('POST /lar-angola/listings/create should create listing', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(larListingEntity) };

			app = await initTestApp([
				{ provide: CreateListingUseCase, useValue: createMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/lar-angola/listings/create`)
				.send({
					propertyId: larPropertyEntity.id,
					ownerId: larUserEntity.id,
					transactionType: 'rent',
					price: 1000,
				})
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larListingHttp),
			});
		});

		it('GET /lar-angola/listings/list should list listings', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larListingEntity]) };

			app = await initTestApp([
				{ provide: ListListingsUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/listings/list`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larListingHttp]),
			});
		});

		it('GET /lar-angola/listings/:id should return listing', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(larListingEntity) };

			app = await initTestApp([
				{ provide: FindListingByIdUseCase, useValue: findMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/listings/${larListingEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larListingHttp),
			});
		});

		it('GET /lar-angola/listings/owner/:ownerId should list by owner', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larListingEntity]) };

			app = await initTestApp([
				{ provide: ListListingsByOwnerUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/listings/owner/${larUserEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larListingHttp]),
			});
		});

		it('GET /lar-angola/listings/property/:propertyId should list by property', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larListingEntity]) };

			app = await initTestApp([
				{ provide: ListListingsByPropertyUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/listings/property/${larPropertyEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larListingHttp]),
			});
		});

		it('PUT /lar-angola/listings/:id should update listing', async () => {
			const updateMock = { execute: jest.fn().mockResolvedValue(larListingEntity) };

			app = await initTestApp([
				{ provide: UpdateListingUseCase, useValue: updateMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.put(`${API_PREFIX}/lar-angola/listings/${larListingEntity.id}`)
				.send({ price: 1100 })
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larListingHttp),
			});
		});

		it('DELETE /lar-angola/listings/:id should delete listing', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeleteListingUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/lar-angola/listings/${larListingEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Listing deleted successfully' },
			});
		});
	});

	describe('Inquiry Controller', () => {
		it('POST /lar-angola/inquiries/create should create inquiry', async () => {
			const createMock = { execute: jest.fn().mockResolvedValue(larInquiryEntity) };

			app = await initTestApp([
				{ provide: CreateInquiryUseCase, useValue: createMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.post(`${API_PREFIX}/lar-angola/inquiries/create`)
				.send({
					listingId: larListingEntity.id,
					name: 'Inquiry Person',
					email: 'inquiry@example.com',
					message: 'Interested',
				})
				.expect(201);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larInquiryHttp),
			});
		});

		it('GET /lar-angola/inquiries/:id should return inquiry', async () => {
			const findMock = { execute: jest.fn().mockResolvedValue(larInquiryEntity) };

			app = await initTestApp([
				{ provide: FindInquiryByIdUseCase, useValue: findMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/inquiries/${larInquiryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates(larInquiryHttp),
			});
		});

		it('GET /lar-angola/inquiries/listing/:listingId should list inquiries', async () => {
			const listMock = { execute: jest.fn().mockResolvedValue([larInquiryEntity]) };

			app = await initTestApp([
				{ provide: ListInquiriesByListingUseCase, useValue: listMock },
				{ provide: HttpBuilder, useValue: httpBuilderMock },
			]);

			const response = await request(app.getHttpServer())
				.get(`${API_PREFIX}/lar-angola/inquiries/listing/${larListingEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: serializeDates([larInquiryHttp]),
			});
		});

		it('DELETE /lar-angola/inquiries/:id should delete inquiry', async () => {
			const deleteMock = { execute: jest.fn().mockResolvedValue(undefined) };

			app = await initTestApp([
				{ provide: DeleteInquiryUseCase, useValue: deleteMock },
			]);

			const response = await request(app.getHttpServer())
				.delete(`${API_PREFIX}/lar-angola/inquiries/${larInquiryEntity.id}`)
				.expect(200);

			expect(response.body).toEqual({
				status: true,
				data: { message: 'Inquiry deleted successfully' },
			});
		});
	});
});


import { Module } from '@nestjs/common';
import { UserModule } from '../user-module';
import { ProviderModule } from '../../shared';
import {
	PropertyCategoryController,
	PropertyController,
	ListingController,
	InquiryController,
	LarAngolaUserController,
} from './controllers';
import {
	IPropertyCategoryRepository, IPropertyRepository, IListingRepository, IInquiryRepository, ILarAngolaUserRepository,
	PrismaPropertyCategoryRepository, PrismaPropertyRepository, PrismaListingRepository, PrismaInquiryRepository, PrismaLarAngolaUserRepository,
} from './repositories';
import {
	CreatePropertyCategoryUseCase, UpdatePropertyCategoryUseCase, DeletePropertyCategoryUseCase, ListPropertyCategoriesUseCase, FindPropertyCategoryByIdUseCase,
	CreatePropertyUseCase, UpdatePropertyUseCase, DeletePropertyUseCase, ListPropertiesUseCase, ListPropertiesByOwnerUseCase, ListPropertiesByCategoryUseCase, FindPropertyByIdUseCase,
	CreateListingUseCase, UpdateListingUseCase, DeleteListingUseCase, ListListingsUseCase, ListListingsByOwnerUseCase, ListListingsByPropertyUseCase, FindListingByIdUseCase,
	CreateInquiryUseCase, DeleteInquiryUseCase, ListInquiriesByListingUseCase, FindInquiryByIdUseCase, CreateLarAngolaUserUseCase, UpdateLarAngolaUserUseCase, DeleteLarAngolaUserUseCase, ListLarAngolaUsersUseCase, FindLarAngolaUserByIdUseCase,
} from './usecases';
import { HttpBuilder } from './utils';

@Module({
	imports: [UserModule, ProviderModule],
	controllers: [
		PropertyCategoryController,
		PropertyController,
		ListingController,
		InquiryController,
		LarAngolaUserController,
	],
	providers: [
		{ provide: IPropertyCategoryRepository, useClass: PrismaPropertyCategoryRepository },
		{ provide: IPropertyRepository, useClass: PrismaPropertyRepository },
		{ provide: IListingRepository, useClass: PrismaListingRepository },
		{ provide: IInquiryRepository, useClass: PrismaInquiryRepository },
		{ provide: ILarAngolaUserRepository, useClass: PrismaLarAngolaUserRepository },

		HttpBuilder,

		CreatePropertyCategoryUseCase,
		UpdatePropertyCategoryUseCase,
		DeletePropertyCategoryUseCase,
		ListPropertyCategoriesUseCase,
		FindPropertyCategoryByIdUseCase,

		CreatePropertyUseCase,
		UpdatePropertyUseCase,
		DeletePropertyUseCase,
		ListPropertiesUseCase,
		ListPropertiesByOwnerUseCase,
		ListPropertiesByCategoryUseCase,
		FindPropertyByIdUseCase,

		CreateListingUseCase,
		UpdateListingUseCase,
		DeleteListingUseCase,
		ListListingsUseCase,
		ListListingsByOwnerUseCase,
		ListListingsByPropertyUseCase,
		FindListingByIdUseCase,

		CreateInquiryUseCase,
		DeleteInquiryUseCase,
		ListInquiriesByListingUseCase,
		FindInquiryByIdUseCase,

		CreateLarAngolaUserUseCase,
		UpdateLarAngolaUserUseCase,
		DeleteLarAngolaUserUseCase,
		ListLarAngolaUsersUseCase,
		FindLarAngolaUserByIdUseCase,
	],
	exports: [
		FindPropertyByIdUseCase,
		FindPropertyCategoryByIdUseCase,
		FindListingByIdUseCase,
		HttpBuilder,
	],
})
export class LarAngolaModule { }

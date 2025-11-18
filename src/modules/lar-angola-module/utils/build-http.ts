import { BadRequestException, Injectable } from '@nestjs/common';
import { PropertyAdapter, ListingAdapter, PropertyCategoryAdapter, LarAngolaUserAdapter } from '../adapter';
import { PropertyEntity, ListingEntity, InquiryEntity } from '../entities';
import { FindPropertyByIdUseCase, FindPropertyCategoryByIdUseCase, FindLarAngolaUserByIdUseCase } from '../usecases';

@Injectable()
export class HttpBuilder {
	constructor(
		private readonly findUserByIdUseCase: FindLarAngolaUserByIdUseCase,
		private readonly findPropertyByIdUseCase: FindPropertyByIdUseCase,
		private readonly findCategoryByIdUseCase: FindPropertyCategoryByIdUseCase,
	) { }

	async buildProperty(propertyEntity: PropertyEntity) {
		const owner = await this.findUserByIdUseCase.execute(propertyEntity.ownerId);
		if (!owner) throw new BadRequestException('Owner user not found');
		const category = await this.findCategoryByIdUseCase.execute(propertyEntity.categoryId);
		if (!category) throw new BadRequestException('Category not found');
		return PropertyAdapter.toHttp(propertyEntity, LarAngolaUserAdapter.toHttp(owner), PropertyCategoryAdapter.toHttp(category));
	}

	async buildListing(listingEntity: ListingEntity) {
		const property = await this.findPropertyByIdUseCase.execute(listingEntity.propertyId);
		if (!property) throw new BadRequestException('Property not found');
		const owner = await this.findUserByIdUseCase.execute(listingEntity.ownerId);
		if (!owner) throw new BadRequestException('Owner user not found');
		const propertyHttp = await this.buildProperty(property);
		return ListingAdapter.toHttp(listingEntity, propertyHttp, LarAngolaUserAdapter.toHttp(owner));
	}

	async buildInquiry(inquiryEntity: InquiryEntity) {
		// Note: For inquiry we show minimal info; listing details can be fetched separately if needed
		const user = inquiryEntity.userId ? await this.findUserByIdUseCase.execute(inquiryEntity.userId) : null;
		return {
			id: inquiryEntity.id,
			name: inquiryEntity.name,
			email: inquiryEntity.email,
			phone: inquiryEntity.phone,
			message: inquiryEntity.message,
			createdAt: inquiryEntity.createdAt,
			listingId: inquiryEntity.listingId,
			user: user ? LarAngolaUserAdapter.toHttp(user) : null,
		};
	}
}



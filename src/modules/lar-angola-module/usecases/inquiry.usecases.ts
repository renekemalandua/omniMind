import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { InquiryEntity } from '../entities';
import { IInquiryRepository, IListingRepository } from '../repositories';
import { CreateInquiryRequestDTO } from '../dto';

@Injectable()
export class CreateInquiryUseCase implements UseCase<CreateInquiryRequestDTO, InquiryEntity> {
	constructor(
		private readonly repository: IInquiryRepository,
		private readonly listingRepository: IListingRepository,
	) { }
	async execute(request: CreateInquiryRequestDTO): Promise<InquiryEntity> {
		const listing = await this.listingRepository.findById(request.listingId);
		if (!listing) throw new BadRequestException('Listing does not exist');
		const entity = InquiryEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class ListInquiriesByListingUseCase implements UseCase<string, InquiryEntity[]> {
	constructor(private readonly repository: IInquiryRepository) { }
	async execute(listingId: string): Promise<InquiryEntity[]> { return this.repository.listByListing(listingId); }
}

@Injectable()
export class FindInquiryByIdUseCase implements UseCase<string, InquiryEntity | null> {
	constructor(private readonly repository: IInquiryRepository) { }
	async execute(id: string): Promise<InquiryEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Inquiry not found');
		return entity;
	}
}

@Injectable()
export class DeleteInquiryUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IInquiryRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Inquiry not found');
		await this.repository.delete(id);
	}
}




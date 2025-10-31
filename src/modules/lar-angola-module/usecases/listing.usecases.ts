import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { ListingEntity } from '../entities';
import { IListingRepository, IPropertyRepository } from '../repositories';
import { CreateListingRequestDTO, UpdateListingRequestDTO } from '../dto';

@Injectable()
export class CreateListingUseCase implements UseCase<CreateListingRequestDTO, ListingEntity> {
	constructor(
		private readonly repository: IListingRepository,
		private readonly propertyRepository: IPropertyRepository,
	) { }
	async execute(request: CreateListingRequestDTO): Promise<ListingEntity> {
		const property = await this.propertyRepository.findById(request.propertyId);
		if (!property) throw new BadRequestException('Property does not exist');
		if (property.ownerId !== request.ownerId) throw new BadRequestException('Owner mismatch');
		const entity = ListingEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateListingUseCase implements UseCase<{ id: string; data: UpdateListingRequestDTO }, ListingEntity> {
	constructor(private readonly repository: IListingRepository) { }
	async execute({ id, data }: { id: string; data: UpdateListingRequestDTO }): Promise<ListingEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Listing not found');
		if (data.transactionType !== undefined) entity.transactionType = data.transactionType!;
		if (data.price !== undefined) entity.price = data.price!;
		if (data.currency !== undefined) entity.currency = data.currency!;
		if (data.status !== undefined) entity.status = data.status!;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteListingUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IListingRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Listing not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListListingsUseCase implements UseCase<void, ListingEntity[]> {
	constructor(private readonly repository: IListingRepository) { }
	async execute(): Promise<ListingEntity[]> { return this.repository.list(); }
}

@Injectable()
export class ListListingsByOwnerUseCase implements UseCase<string, ListingEntity[]> {
	constructor(private readonly repository: IListingRepository) { }
	async execute(ownerId: string): Promise<ListingEntity[]> { return this.repository.listByOwner(ownerId); }
}

@Injectable()
export class ListListingsByPropertyUseCase implements UseCase<string, ListingEntity[]> {
	constructor(private readonly repository: IListingRepository) { }
	async execute(propertyId: string): Promise<ListingEntity[]> { return this.repository.listByProperty(propertyId); }
}

@Injectable()
export class FindListingByIdUseCase implements UseCase<string, ListingEntity | null> {
	constructor(private readonly repository: IListingRepository) { }
	async execute(id: string): Promise<ListingEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Listing not found');
		return entity;
	}
}



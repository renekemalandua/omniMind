import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { PropertyEntity } from '../entities';
import { IPropertyCategoryRepository, IPropertyRepository } from '../repositories';
import { CreatePropertyRequestDTO, UpdatePropertyRequestDTO } from '../dto';

@Injectable()
export class CreatePropertyUseCase implements UseCase<CreatePropertyRequestDTO, PropertyEntity> {
	constructor(
		private readonly repository: IPropertyRepository,
		private readonly categoryRepository: IPropertyCategoryRepository,
	) { }
	async execute(request: CreatePropertyRequestDTO): Promise<PropertyEntity> {
		const category = await this.categoryRepository.findById(request.categoryId);
		if (!category) throw new BadRequestException('Category does not exist');
		const entity = PropertyEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdatePropertyUseCase implements UseCase<{ id: string; data: UpdatePropertyRequestDTO }, PropertyEntity> {
	constructor(private readonly repository: IPropertyRepository) { }
	async execute({ id, data }: { id: string; data: UpdatePropertyRequestDTO }): Promise<PropertyEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Property not found');
		if (data.categoryId) entity['props'].categoryId = data.categoryId;
		if (data.title !== undefined) entity.title = data.title!;
		if (data.description !== undefined) entity.description = data.description ?? null;
		if (data.address !== undefined) entity.address = data.address ?? null;
		if (data.city !== undefined) entity.city = data.city ?? null;
		if (data.state !== undefined) entity.state = data.state ?? null;
		if (data.country !== undefined) entity.country = data.country ?? null;
		if (data.latitude !== undefined) entity.latitude = data.latitude ?? null;
		if (data.longitude !== undefined) entity.longitude = data.longitude ?? null;
		if (data.bedrooms !== undefined) entity.bedrooms = data.bedrooms ?? null;
		if (data.bathrooms !== undefined) entity.bathrooms = data.bathrooms ?? null;
		if (data.areaSqm !== undefined) entity.areaSqm = data.areaSqm ?? null;
		if (data.amenities !== undefined) entity.amenities = data.amenities ?? null;
		if (data.images !== undefined) entity.images = data.images ?? null;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeletePropertyUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IPropertyRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Property not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListPropertiesUseCase implements UseCase<void, PropertyEntity[]> {
	constructor(private readonly repository: IPropertyRepository) { }
	async execute(): Promise<PropertyEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListPropertiesByOwnerUseCase implements UseCase<string, PropertyEntity[]> {
	constructor(private readonly repository: IPropertyRepository) { }
	async execute(ownerId: string): Promise<PropertyEntity[]> {
		return this.repository.listByOwner(ownerId);
	}
}

@Injectable()
export class ListPropertiesByCategoryUseCase implements UseCase<string, PropertyEntity[]> {
	constructor(private readonly repository: IPropertyRepository) { }
	async execute(categoryId: string): Promise<PropertyEntity[]> {
		return this.repository.listByCategory(categoryId);
	}
}

@Injectable()
export class FindPropertyByIdUseCase implements UseCase<string, PropertyEntity | null> {
	constructor(private readonly repository: IPropertyRepository) { }
	async execute(id: string): Promise<PropertyEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Property not found');
		return entity;
	}
}



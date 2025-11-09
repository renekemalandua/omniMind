import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { PropertyCategoryEntity } from '../entities';
import { IPropertyCategoryRepository } from '../repositories';
import { CreatePropertyCategoryRequestDTO, UpdatePropertyCategoryRequestDTO } from '../dto';

@Injectable()
export class CreatePropertyCategoryUseCase implements UseCase<CreatePropertyCategoryRequestDTO, PropertyCategoryEntity> {
	constructor(private readonly repository: IPropertyCategoryRepository) { }
	async execute(request: CreatePropertyCategoryRequestDTO): Promise<PropertyCategoryEntity> {
		const exists = await this.repository.findByName(request.name);
		if (exists) throw new BadRequestException('Category with this name already exists');
		const entity = PropertyCategoryEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdatePropertyCategoryUseCase implements UseCase<{ id: string; data: UpdatePropertyCategoryRequestDTO }, PropertyCategoryEntity> {
	constructor(private readonly repository: IPropertyCategoryRepository) { }
	async execute({ id, data }: { id: string; data: UpdatePropertyCategoryRequestDTO }): Promise<PropertyCategoryEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Category not found');
		if (data.name) entity.name = data.name;
		if (data.description !== undefined) entity.description = data.description ?? null;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeletePropertyCategoryUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IPropertyCategoryRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Category not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListPropertyCategoriesUseCase implements UseCase<void, PropertyCategoryEntity[]> {
	constructor(private readonly repository: IPropertyCategoryRepository) { }
	async execute(): Promise<PropertyCategoryEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class FindPropertyCategoryByIdUseCase implements UseCase<string, PropertyCategoryEntity | null> {
	constructor(private readonly repository: IPropertyCategoryRepository) { }
	async execute(id: string): Promise<PropertyCategoryEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Category not found');
		return entity;
	}
}




import { PropertyCategoryEntity } from "../entities";

export abstract class IPropertyCategoryRepository {
	abstract create(data: PropertyCategoryEntity): Promise<PropertyCategoryEntity>;
	abstract list(): Promise<PropertyCategoryEntity[]>;
	abstract findById(id: string): Promise<PropertyCategoryEntity | null>;
	abstract findByName(name: string): Promise<PropertyCategoryEntity | null>;
	abstract update(data: PropertyCategoryEntity): Promise<PropertyCategoryEntity>;
	abstract delete(id: string): Promise<void>;
}



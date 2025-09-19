import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

interface IProductCategoryProps {
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductCategoryEntity extends AggregateRoot<IProductCategoryProps> {
  static create(
    props: Optional<IProductCategoryProps, "description" | "createdAt" | "updatedAt">,
    id?: IdValueObject
  ) {
    return new ProductCategoryEntity(
      {
        name: props.name,
        description: props.description ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public static updateDescription(category: ProductCategoryEntity, description: string) {
    category.props.description = description;
    category.touch();
  }

  // ===== Getters =====
  public get name(): string {
    return this.props.name;
  }

  public get description(): string | null {
    return this.props.description;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ===== Setters =====
  public set name(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  public set description(desc: string | null) {
    this.props.description = desc;
    this.touch();
  }
}

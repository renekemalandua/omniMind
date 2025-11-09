import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

interface IProductProps {
	ownerId: string;
	categoryId: string;
	name: string;
	description: string | null;
	image: string | null;
	price: number;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
}

export class ProductEntity extends AggregateRoot<IProductProps> {
	static create(
		props: Optional<
			IProductProps,
			"description" | "image" | "createdAt" | "updatedAt"
		>,
		id?: IdValueObject
	) {
		return new ProductEntity(
			{
				ownerId: props.ownerId,
				categoryId: props.categoryId,
				name: props.name,
				description: props.description ?? null,
				image: props.image ?? null,
				price: props.price,
				quantity: props.quantity,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id
		);
	}

	protected touch(): void {
		this.props.updatedAt = new Date();
	}

	public static updatePrice(product: ProductEntity, price: number) {
		product.props.price = price;
		product.touch();
	}

	public static updateQuantity(product: ProductEntity, quantity: number) {
		product.props.quantity = quantity;
		product.touch();
	}

	public static updateDescription(product: ProductEntity, description: string) {
		product.props.description = description;
		product.touch();
	}

	// ===== Getters =====
	public get ownerId(): string {
		return this.props.ownerId;
	}

	public get categoryId(): string {
		return this.props.categoryId;
	}

	public get name(): string {
		return this.props.name;
	}

	public get description(): string | null {
		return this.props.description;
	}

	public get image(): string | null {
		return this.props.image;
	}

	public get price(): number {
		return this.props.price;
	}

	public get quantity(): number {
		return this.props.quantity;
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

	public set image(image: string | null) {
		this.props.image = image;
		this.touch();
	}

	public set price(price: number) {
		this.props.price = price;
		this.touch();
	}

	public set quantity(quantity: number) {
		this.props.quantity = quantity;
		this.touch();
	}
}

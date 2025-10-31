import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

export type TransactionType = 'rent' | 'sale';
export type ListingStatus = 'active' | 'inactive';

interface IListingProps {
	propertyId: string;
	ownerId: string;
	transactionType: TransactionType;
	price: number;
	currency: string;
	status: ListingStatus;
	createdAt: Date;
	updatedAt: Date;
}

export class ListingEntity extends AggregateRoot<IListingProps> {
	static create(
		props: Optional<IListingProps, "currency" | "status" | "createdAt" | "updatedAt">,
		id?: IdValueObject,
	) {
		return new ListingEntity(
			{
				propertyId: props.propertyId,
				ownerId: props.ownerId,
				transactionType: props.transactionType,
				price: props.price,
				currency: props.currency ?? 'AOA',
				status: props.status ?? 'active',
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void { this.props.updatedAt = new Date(); }

	public get propertyId(): string { return this.props.propertyId; }
	public get ownerId(): string { return this.props.ownerId; }
	public get transactionType(): TransactionType { return this.props.transactionType; }
	public set transactionType(v: TransactionType) { this.props.transactionType = v; this.touch(); }
	public get price(): number { return this.props.price; }
	public set price(v: number) { this.props.price = v; this.touch(); }
	public get currency(): string { return this.props.currency; }
	public set currency(v: string) { this.props.currency = v; this.touch(); }
	public get status(): ListingStatus { return this.props.status; }
	public set status(v: ListingStatus) { this.props.status = v; this.touch(); }
	public get createdAt(): Date { return this.props.createdAt; }
	public get updatedAt(): Date { return this.props.updatedAt; }
}


import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

interface IInquiryProps {
	listingId: string;
	userId: string | null;
	name: string;
	email: string;
	phone: string | null;
	message: string;
	createdAt: Date;
}

export class InquiryEntity extends AggregateRoot<IInquiryProps> {
	static create(
		props: Optional<IInquiryProps, "userId" | "phone" | "createdAt">,
		id?: IdValueObject,
	) {
		return new InquiryEntity(
			{
				listingId: props.listingId,
				userId: props.userId ?? null,
				name: props.name,
				email: props.email,
				phone: props.phone ?? null,
				message: props.message,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
	}

	protected touch(): void { }

	public get listingId(): string { return this.props.listingId; }
	public get userId(): string | null { return this.props.userId; }
	public get name(): string { return this.props.name; }
	public get email(): string { return this.props.email; }
	public get phone(): string | null { return this.props.phone; }
	public get message(): string { return this.props.message; }
	public get createdAt(): Date { return this.props.createdAt; }
}




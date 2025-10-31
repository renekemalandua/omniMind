import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

export type LarAngolaUserRole = 'intermediary' | 'client';

interface ILarAngolaUserProps {
	userId: string;
	role: LarAngolaUserRole;
	fullName: string;
	phone: string | null;
	city: string | null;
	preferences: unknown | null;
	createdAt: Date;
	updatedAt: Date;
}

export class LarAngolaUserEntity extends AggregateRoot<ILarAngolaUserProps> {
	static create(
		props: Optional<ILarAngolaUserProps, "phone" | "city" | "preferences" | "createdAt" | "updatedAt">,
		id?: IdValueObject,
	) {
		return new LarAngolaUserEntity(
			{
				...props,
				phone: props.phone ?? null,
				city: props.city ?? null,
				preferences: props.preferences ?? null,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		);
	}

	get id() { return this._id!.value; }
	get userId() { return this.props.userId; }
	get role() { return this.props.role; }
	get fullName() { return this.props.fullName; }
	get phone() { return this.props.phone; }
	get city() { return this.props.city; }
	get preferences() { return this.props.preferences; }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }

	set fullName(v: string) { this.props.fullName = v; }
	set phone(v: string | null) { this.props.phone = v; }
	set city(v: string | null) { this.props.city = v; }
	set preferences(v: unknown | null) { this.props.preferences = v; }
}



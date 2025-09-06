import { AggregateRoot, IdValueObject, Optional } from "src/shared";

interface IUserProps {
  email: string;
  phone: string;
  identityNumber?: string;
  password: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserEntity extends AggregateRoot<IUserProps> {
  static create(props: Optional<IUserProps, 'createdAt'>, id?: IdValueObject) {
    return new UserEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  // ===== Métodos de domínio =====
  public updatePassword(newPassword: string): void {
    this.props.password = newPassword;
    this.touch();
  }

  public updatePhone(newPhone: string): void {
    this.props.phone = newPhone;
    this.touch();
  }

  public updateIdentityNumber(identityNumber: string): void {
    this.props.identityNumber = identityNumber;
    this.touch();
  }

  public updateEmail(email: string): void {
    this.props.email = email;
    this.props.isVerified = false;
    this.touch();
  }

  public updateIsVerified(isVerified: boolean): void {
    this.props.isVerified = isVerified;
    this.touch();
  }

  public updateIsActive(isActive: boolean): void {
    this.props.isActive = isActive;
    this.touch();
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  // ===== Getters =====

  public get email(): string {
    return this.props.email;
  }

  public get phone(): string {
    return this.props.phone;
  }

  public get identityNumber(): string {
    return this.props.identityNumber ?? "";
  }

  public get password(): string {
    return this.props.password;
  }

  public get isActive(): boolean {
    return this.props.isActive ?? false;
  }

  public get isVerified(): boolean {
    return this.props.isVerified ?? false;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }
}

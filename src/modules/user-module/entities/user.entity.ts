import { AggregateRoot, IdValueObject, Optional } from "src/shared";

interface IUserProps {
  email: string;
  phone: string;
  identityNumber?: string | null;
  password: string;
  isActive?: boolean;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  isIdentityVerified?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
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

  // ===== Domain =====
  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  static verifyUser(user: UserEntity): void {
    if (!user.props.isVerified) {
      user.props.isVerified = true;
      user.touch();
    }
  }

  static verifyEmail(user: UserEntity): void {
    if (!user.props.isEmailVerified) {
      user.props.isEmailVerified = true;
      user.touch();
    }
  }

  static verifyIdentity(user: UserEntity): void {
    if (!user.props.isIdentityVerified) {
      user.props.isIdentityVerified = true;
      user.touch();
    }
  }

  static activateUser(user: UserEntity): void {
    if (!user.props.isActive) {
      user.props.isActive = true;
      user.touch();
    }
  }

  static deactivateUser(user: UserEntity): void {
    if (user.props.isActive) {
      user.props.isActive = false;
      user.touch();
    }
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

  public get isEmailVerified(): boolean {
    return this.props.isEmailVerified ?? false;
  }

  public get isIdentityVerified(): boolean {
    return this.props.isIdentityVerified ?? false;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  // ===== Setters =====
  public set password(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  public set phone(newPhone: string) {
    this.props.phone = newPhone;
    this.touch();
  }

  public set identityNumber(identityNumber: string) {
    this.props.identityNumber = identityNumber;
    this.touch();
  }

  public set email(email: string) {
    this.props.email = email;
    this.props.isVerified = false;
    this.touch();
  }

  public set isVerified(isVerified: boolean) {
    this.props.isVerified = isVerified;
    this.touch();
  }

  public set isActive(isActive: boolean) {
    this.props.isActive = isActive;
    this.touch();
  }

}

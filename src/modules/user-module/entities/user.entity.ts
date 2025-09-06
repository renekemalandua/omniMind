interface IUserProps {
  id: string;
  email: string;
  phone: string;
  identityNumber: string | null;
  password: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  private props: IUserProps;

  constructor(props: IUserProps) {
    this.props = { ...props };
  }

  static create(props: IUserProps) {
    return new UserEntity(
      {
        ...props,
        id: props.id,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.createdAt ?? new Date(),
        isActive: props.isActive ?? true,
        isVerified: props.isVerified ?? false,
      }
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

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  // ===== Getters =====
  public get id(): string {
    return this.props.id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get phone(): string {
    return this.props.phone;
  }

  public get identityNumber(): string | null {
    return this.props.identityNumber;
  }

  public get password(): string {
    return this.props.password;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public get isVerified(): boolean {
    return this.props.isVerified;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

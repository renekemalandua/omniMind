import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

interface IKimaAppUserProps {
  userId: string;
  type: HTTP.KimaApp.KimaAppUserType;
  name: string;
  nif: string | null;
  address: string | null;
  region: string | null;
  farmSize: number | null;
  companyType: string | null;
  vehicleType: string | null;
  licenseNumber: string | null;
  productsCarried: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class KimaAppUserEntity extends AggregateRoot<IKimaAppUserProps> {
  static create(
    props: Optional<
      IKimaAppUserProps,
      | "createdAt"
      | "updatedAt"
      | "nif"
      | "address"
      | "region"
      | "farmSize"
      | "companyType"
      | "vehicleType"
      | "licenseNumber"
      | "productsCarried"
    >,
    id?: IdValueObject
  ) {
    return new KimaAppUserEntity(
      {
        userId: props.userId,
        type: props.type,
        name: props.name,
        nif: props.nif ?? null,
        address: props.address ?? null,
        region: props.region ?? null,
        farmSize: props.farmSize ?? null,
        companyType: props.companyType ?? null,
        vehicleType: props.vehicleType ?? null,
        licenseNumber: props.licenseNumber ?? null,
        productsCarried: props.productsCarried ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public static updateAddress(entity: KimaAppUserEntity, address: string) {
    entity.props.address = address;
    entity.touch();
  }

  public static updateRegion(entity: KimaAppUserEntity, region: string) {
    entity.props.region = region;
    entity.touch();
  }

  public static updateVehicle(entity: KimaAppUserEntity, vehicleType: string) {
    entity.props.vehicleType = vehicleType;
    entity.touch();
  }

  // ===== Getters =====
  public get userId(): string {
    return this.props.userId;
  }

  public get type(): HTTP.KimaApp.KimaAppUserType {
    return this.props.type;
  }

  public get name(): string {
    return this.props.name;
  }

  public get nif(): string | null {
    return this.props.nif;
  }

  public get address(): string | null {
    return this.props.address;
  }

  public get region(): string | null {
    return this.props.region;
  }

  public get farmSize(): number | null {
    return this.props.farmSize;
  }

  public get companyType(): string | null {
    return this.props.companyType;
  }

  public get vehicleType(): string | null {
    return this.props.vehicleType;
  }

  public get licenseNumber(): string | null {
    return this.props.licenseNumber;
  }

  public get productsCarried(): string | null {
    return this.props.productsCarried;
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

  public set nif(nif: string | null) {
    this.props.nif = nif;
    this.touch();
  }

  public set farmSize(size: number | null) {
    this.props.farmSize = size;
    this.touch();
  }

  public set companyType(type: string | null) {
    this.props.companyType = type;
    this.touch();
  }

  public set vehicleType(vehicle: string | null) {
    this.props.vehicleType = vehicle;
    this.touch();
  }

  public set licenseNumber(license: string | null) {
    this.props.licenseNumber = license;
    this.touch();
  }

  public set productsCarried(products: string | null) {
    this.props.productsCarried = products;
    this.touch();
  }

  public set region(region: string | null) {
    this.props.region = region;
    this.touch();
  }

  public set address(address: string | null) {
    this.props.address = address;
    this.touch();
  }
}

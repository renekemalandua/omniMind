import { AggregateRoot, IdValueObject, Optional } from "../../../shared";

interface IOrderProps {
  productId: string;
  buyerId: string;
  driverId: string | null;
  status: HTTP.KimaApp.OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderEntity extends AggregateRoot<IOrderProps> {
  static create(
    props: Optional<IOrderProps, "driverId" | "createdAt" | "updatedAt" | "status">,
    id?: IdValueObject
  ) {
    return new OrderEntity(
      {
        productId: props.productId,
        buyerId: props.buyerId,
        driverId: props.driverId ?? null,
        status: props.status ?? "pending",
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  public static assignDriver(order: OrderEntity, driverId: string) {
    order.props.driverId = driverId;
    order.touch();
  }

  public static updateStatus(order: OrderEntity, status: HTTP.KimaApp.OrderStatus) {
    order.props.status = status;
    order.touch();
  }

  // ===== Getters =====
  public get productId(): string {
    return this.props.productId;
  }

  public get buyerId(): string {
    return this.props.buyerId;
  }

  public get driverId(): string | null {
    return this.props.driverId;
  }

  public get status(): HTTP.KimaApp.OrderStatus {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ===== Setters =====
  public set driverId(driver: string | null) {
    this.props.driverId = driver;
    this.touch();
  }

  public set status(status: HTTP.KimaApp.OrderStatus) {
    this.props.status = status;
    this.touch();
  }
}

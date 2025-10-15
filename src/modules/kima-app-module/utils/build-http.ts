import { BadRequestException } from '@nestjs/common';
import { UserEntity, UserAdapter } from 'src/modules/user-module';
import {
  KimaAppUserAdapter,
  ProductAdapter,
  OrderAdapter,
  ProductCategoryAdapter
} from '../adapter';
import {
  OrderEntity,
  KimaAppUserEntity,
  ProductEntity,
  ProductCategoryEntity
} from '../entities';

export class HttpBuilder {
  constructor(
    private readonly findUserById: (id: string) => Promise<UserEntity | null>,
    private readonly findKimaUserById: (id: string) => Promise<KimaAppUserEntity | null>,
    private readonly findProductById: (id: string) => Promise<ProductEntity | null>,
    private readonly findCategoryById?: (id: string) => Promise<ProductCategoryEntity | null>,
  ) {}

  async buildProduct(productEntity: ProductEntity): Promise<HTTP.KimaApp.ProductResponse> {
    const ownerEntity = await this.findKimaUserById(productEntity.ownerId);
    if (!ownerEntity) throw new BadRequestException('Owner not found');

    const user = await this.findUserById(ownerEntity.userId);
    if (!user) throw new BadRequestException('User not found');

    const ownerHttp = KimaAppUserAdapter.toHttp(ownerEntity, UserAdapter.toHttp(user));
    if (ownerHttp.type !== 'farmer') throw new BadRequestException('Owner must be a farmer');

    if (!this.findCategoryById) throw new BadRequestException('Category resolver not provided');

    const categoryEntity = await this.findCategoryById(productEntity.categoryId);
    if (!categoryEntity) throw new BadRequestException('Category not found');

    const categoryHttp = ProductCategoryAdapter.toHttp(categoryEntity);
    return ProductAdapter.toHttp(productEntity, ownerHttp as HTTP.KimaApp.FarmerUserResponse, categoryHttp);
  }

  async buildOrder(orderEntity: OrderEntity): Promise<HTTP.KimaApp.OrderResponse> {
    const productEntity = await this.findProductById(orderEntity.productId);
    if (!productEntity) throw new BadRequestException('Product not found');

    const productHttp = await this.buildProduct(productEntity);

    const buyerEntity = await this.findKimaUserById(orderEntity.buyerId);
    if (!buyerEntity) throw new BadRequestException('Buyer not found');

    const buyerUser = await this.findUserById(buyerEntity.userId);
    if (!buyerUser) throw new BadRequestException('Buyer user not found');

    const buyerHttp = KimaAppUserAdapter.toHttp(buyerEntity, UserAdapter.toHttp(buyerUser));
    if (!['company', 'seller'].includes(buyerHttp.type))
      throw new BadRequestException('Buyer must be company or seller');

    let driverHttp: HTTP.KimaApp.DriverUserResponse | null = null;

    if (orderEntity.driverId) {
      const driverEntity = await this.findKimaUserById(orderEntity.driverId);
      if (!driverEntity) throw new BadRequestException('Driver not found');

      const driverUser = await this.findUserById(driverEntity.userId);
      if (!driverUser) throw new BadRequestException('Driver user not found');

      const driver = KimaAppUserAdapter.toHttp(driverEntity, UserAdapter.toHttp(driverUser));
      if (driver.type !== 'driver')
        throw new BadRequestException('Driver must be driver type');

      driverHttp = driver as HTTP.KimaApp.DriverUserResponse;
    }

    return OrderAdapter.toHttp(orderEntity, productHttp, buyerHttp as ( HTTP.KimaApp.CompanyUserResponse | HTTP.KimaApp.SellerUserResponse), driverHttp);
  }

  
}

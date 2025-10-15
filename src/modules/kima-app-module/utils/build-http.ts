import { BadRequestException } from '@nestjs/common';
import { UserAdapter, FindUserByIdUseCase } from '../../user-module';
import {
  KimaAppUserAdapter,
  ProductAdapter,
  OrderAdapter,
  ProductCategoryAdapter
} from '../adapter';
import {
  OrderEntity,
  ProductEntity,
} from '../entities';
import {
  FindKimaAppUserByIdUseCase,
  FindProductByIdUseCase,
  FindProductCategoryByIdUseCase
} from '../usecases';

export class HttpBuilder {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findKimaUserByIdUseCase: FindKimaAppUserByIdUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly findCategoryByIdUseCase?: FindProductCategoryByIdUseCase,
  ) {}

  async buildProduct(productEntity: ProductEntity): Promise<HTTP.KimaApp.ProductResponse> {
    const ownerEntity = await this.findKimaUserByIdUseCase.execute(productEntity.ownerId);
    if (!ownerEntity) throw new BadRequestException('Owner not found');

    const user = await this.findUserByIdUseCase.execute(ownerEntity.userId);
    if (!user) throw new BadRequestException('User not found');

    const ownerHttp = KimaAppUserAdapter.toHttp(ownerEntity, UserAdapter.toHttp(user));
    if (ownerHttp.type !== 'farmer') throw new BadRequestException('Owner must be a farmer');

    if (!this.findCategoryByIdUseCase) throw new BadRequestException('Category resolver not provided');

    const categoryEntity = await this.findCategoryByIdUseCase.execute(productEntity.categoryId);
    if (!categoryEntity) throw new BadRequestException('Category not found');

    const categoryHttp = ProductCategoryAdapter.toHttp(categoryEntity);
    return ProductAdapter.toHttp(
      productEntity,
      ownerHttp as HTTP.KimaApp.FarmerUserResponse,
      categoryHttp,
    );
  }

  async buildOrder(orderEntity: OrderEntity): Promise<HTTP.KimaApp.OrderResponse> {
    const productEntity = await this.findProductByIdUseCase.execute(orderEntity.productId);
    if (!productEntity) throw new BadRequestException('Product not found');

    const productHttp = await this.buildProduct(productEntity);

    const buyerEntity = await this.findKimaUserByIdUseCase.execute(orderEntity.buyerId);
    if (!buyerEntity) throw new BadRequestException('Buyer not found');

    const buyerUser = await this.findUserByIdUseCase.execute(buyerEntity.userId);
    if (!buyerUser) throw new BadRequestException('Buyer user not found');

    const buyerHttp = KimaAppUserAdapter.toHttp(buyerEntity, UserAdapter.toHttp(buyerUser));
    if (!['company', 'seller'].includes(buyerHttp.type))
      throw new BadRequestException('Buyer must be company or seller');

    let driverHttp: HTTP.KimaApp.DriverUserResponse | null = null;

    if (orderEntity.driverId) {
      const driverEntity = await this.findKimaUserByIdUseCase.execute(orderEntity.driverId);
      if (!driverEntity) throw new BadRequestException('Driver not found');

      const driverUser = await this.findUserByIdUseCase.execute(driverEntity.userId);
      if (!driverUser) throw new BadRequestException('Driver user not found');

      const driver = KimaAppUserAdapter.toHttp(driverEntity, UserAdapter.toHttp(driverUser));
      if (driver.type !== 'driver')
        throw new BadRequestException('Driver must be driver type');

      driverHttp = driver as HTTP.KimaApp.DriverUserResponse;
    }

    return OrderAdapter.toHttp(
      orderEntity,
      productHttp,
      buyerHttp as HTTP.KimaApp.CompanyUserResponse | HTTP.KimaApp.SellerUserResponse,
      driverHttp,
    );
  }
}

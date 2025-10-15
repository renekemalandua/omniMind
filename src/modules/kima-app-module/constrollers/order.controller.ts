import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateOrderUseCase,
  UpdateOrderUseCase,
  DeleteOrderUseCase,
  ListOrdersUseCase,
  ListOrdersByBuyerUseCase,
  ListOrdersByDriverUseCase,
  ListOrdersByProductUseCase,
  FindOrderByIdUseCase,
} from '../usecases';
import { HttpErrorResponseDTO } from '../../../shared';
import { CreateOrderRequestDTO, UpdateOrderRequestDTO } from '../dto';
import { HttpBuilder } from '../utils';

@ApiTags('Orders')
@Controller('kima-app/orders')
export class OrderController {
  constructor(
    private readonly createUseCase: CreateOrderUseCase,
    private readonly updateUseCase: UpdateOrderUseCase,
    private readonly deleteUseCase: DeleteOrderUseCase,
    private readonly listUseCase: ListOrdersUseCase,
    private readonly listByBuyerUseCase: ListOrdersByBuyerUseCase,
    private readonly listByDriverUseCase: ListOrdersByDriverUseCase,
    private readonly listByProductUseCase: ListOrdersByProductUseCase,
    private readonly findByIdUseCase: FindOrderByIdUseCase,
    private readonly httpBuilder: HttpBuilder,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() data: CreateOrderRequestDTO, @Res() response) {
    try {
      const orderEntity = await this.createUseCase.execute(data);
      const orderHttp = await this.httpBuilder.buildOrder(orderEntity);
      return response.status(201).json({ status: true, data: orderHttp });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Orders' })
  @ApiResponse({ status: 200, description: 'Orders returned successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildOrder(entity);
          } catch {
            return null;
          }
        }),
      );
      const filtered = data.filter(Boolean);
      return response.status(200).json({ status: true, data: filtered });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      const orderHttp = await this.httpBuilder.buildOrder(entity);
      return response.status(200).json({ status: true, data: orderHttp });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('buyer/:buyerId')
  @ApiOperation({ summary: 'List Orders by Buyer' })
  @ApiParam({ name: 'buyerId', description: 'Buyer ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByBuyer(@Param('buyerId') buyerId: string, @Res() response) {
    try {
      const entities = await this.listByBuyerUseCase.execute(buyerId);
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildOrder(entity);
          } catch {
            return null;
          }
        }),
      );
      const filtered = data.filter(Boolean);
      return response.status(200).json({ status: true, data: filtered });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'List Orders by Driver' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByDriver(@Param('driverId') driverId: string, @Res() response) {
    try {
      const entities = await this.listByDriverUseCase.execute(driverId);
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildOrder(entity);
          } catch {
            return null;
          }
        }),
      );
      const filtered = data.filter(Boolean);
      return response.status(200).json({ status: true, data: filtered });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'List Orders by Product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByProduct(@Param('productId') productId: string, @Res() response) {
    try {
      const entities = await this.listByProductUseCase.execute(productId);
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildOrder(entity);
          } catch {
            return null;
          }
        }),
      );
      const filtered = data.filter(Boolean);
      return response.status(200).json({ status: true, data: filtered });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(@Param('id') id: string, @Body() data: UpdateOrderRequestDTO, @Res() response) {
    try {
      const entity = await this.updateUseCase.execute({ id, data });
      const orderHttp = await this.httpBuilder.buildOrder(entity);
      return response.status(200).json({ status: true, data: orderHttp });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response.status(200).json({
        status: true,
        data: { message: 'Order deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

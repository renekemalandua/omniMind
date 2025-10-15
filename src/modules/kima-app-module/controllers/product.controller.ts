import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  ListProductsUseCase,
  ListProductsByOwnerUseCase,
  ListProductsByCategoryUseCase,
  FindProductByIdUseCase,
} from '../usecases';
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from '../dto';
import { HttpErrorResponseDTO } from '../../../shared';
import { HttpBuilder } from '../utils';

@ApiTags('Products')
@Controller('kima-app/products')
export class ProductController {
  constructor(
    private readonly createUseCase: CreateProductUseCase,
    private readonly updateUseCase: UpdateProductUseCase,
    private readonly deleteUseCase: DeleteProductUseCase,
    private readonly listUseCase: ListProductsUseCase,
    private readonly listByOwnerUseCase: ListProductsByOwnerUseCase,
    private readonly listByCategoryUseCase: ListProductsByCategoryUseCase,
	private readonly findByIdUseCase: FindProductByIdUseCase,
	private readonly httpBuilder: HttpBuilder,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() body: CreateProductRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
	  const data = await this.httpBuilder.buildProduct(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Products' })
  @ApiResponse({ status: 200, description: 'Products returned successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildProduct(entity);
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
  @ApiOperation({ summary: 'Find Product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
  	const entity = await this.findByIdUseCase.execute(id);
  	if (!entity) throw new BadRequestException('Product not found');
  	const data = await this.httpBuilder.buildProduct(entity);
  	return response.status(200).json({ status: true, data });
    } catch (error) {
  	throw new BadRequestException(error.message);
    }
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'List Products by Owner' })
  @ApiParam({ name: 'ownerId', description: 'Owner ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByOwner(@Param('ownerId') ownerId: string, @Res() response) {
    try {
      const entities = await this.listByOwnerUseCase.execute(ownerId);
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildProduct(entity);
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

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'List Products by Category' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByCategory(@Param('categoryId') categoryId: string, @Res() response) {
    try {
      const entities = await this.listByCategoryUseCase.execute(categoryId);
      const data = await Promise.all(
        entities.map(async (entity) => {
          try {
            return await this.httpBuilder.buildProduct(entity);
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
  @ApiOperation({ summary: 'Update Product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductRequestDTO,
    @Res() response,
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data });
      if (!entity) throw new BadRequestException('Product not found');
	  const result = await this.httpBuilder.buildProduct(entity);
      return response.status(200).json({ status: true, data: result });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response.status(200).json({
        status: true,
        data: { message: 'Product deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

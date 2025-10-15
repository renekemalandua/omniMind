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
  CreateProductCategoryUseCase,
  UpdateProductCategoryUseCase,
  DeleteProductCategoryUseCase,
  ListProductCategoriesUseCase,
  FindProductCategoryByIdUseCase,
} from '../usecases';
import {
  CreateProductCategoryRequestDTO,
  UpdateProductCategoryRequestDTO,
} from '../dto';
import { HttpErrorResponseDTO } from '../../../shared';
import { ProductCategoryAdapter } from '../adapter';

@ApiTags('Product Categories')
@Controller('kima-app/product-categories')
export class ProductCategoryController {
  constructor(
    private readonly createUseCase: CreateProductCategoryUseCase,
    private readonly updateUseCase: UpdateProductCategoryUseCase,
    private readonly deleteUseCase: DeleteProductCategoryUseCase,
    private readonly listUseCase: ListProductCategoriesUseCase,
    private readonly findByIdUseCase: FindProductCategoryByIdUseCase,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Product Category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(
    @Body() body: CreateProductCategoryRequestDTO,
    @Res() response,
  ) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = ProductCategoryAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Product Categories' })
  @ApiResponse({ status: 200, description: 'Categories listed successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = entities.map((e) => ProductCategoryAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Product Category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      if (!entity) throw new BadRequestException('Category not found');

      const data = ProductCategoryAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Product Category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductCategoryRequestDTO,
    @Res() response,
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data: body });
      if (!entity) throw new BadRequestException('Category not found');

      const data = ProductCategoryAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Product Category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response.status(200).json({
        status: true,
        data: { message: 'Category deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

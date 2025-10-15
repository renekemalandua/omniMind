import {
  Controller,
  Post,
  Get,
  Put,
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
  CreateKimaAppUserUseCase,
  ListKimaAppUsersUseCase,
  FindKimaAppUserByIdUseCase,
  UpdateKimaAppUserUseCase,
} from '../usecases';
import {
  CreateKimaAppUserRequestDTO,
  UpdateKimaAppUserRequestDTO,
} from '../dto';
import { KimaAppUserAdapter } from '../adapter';
import { HttpErrorResponseDTO } from '../../../shared';
import { FindUserByIdUseCase, UserAdapter } from '../../user-module';

@ApiTags('KimaAppUsers')
@Controller('kima-app/user')
export class KimaAppUserController {
  constructor(
    private readonly createUseCase: CreateKimaAppUserUseCase,
    private readonly listUseCase: ListKimaAppUsersUseCase,
    private readonly findByIdUseCase: FindKimaAppUserByIdUseCase,
    private readonly updateUseCase: UpdateKimaAppUserUseCase,
    private readonly findUserByIdCase: FindUserByIdUseCase,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Kima App User' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: HttpErrorResponseDTO,
  })
  async create(@Body() body: CreateKimaAppUserRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
      const user = await this.findUserByIdCase.execute(entity.userId);
      if (!user) throw new BadRequestException('User not found');

      const userHttp = UserAdapter.toHttp(user);
      const data = KimaAppUserAdapter.toHttp(entity, userHttp);

      return response.status(201).json({
        status: true,
        data,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Kima App Users' })
  @ApiResponse({ status: 200, description: 'List of users returned' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: HttpErrorResponseDTO,
  })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();

      const data = await Promise.all(
        entities.map(async (entity) => {
          const user = await this.findUserByIdCase.execute(entity.userId);
          if (!user) return null;

          const userHttp = UserAdapter.toHttp(user);
          return KimaAppUserAdapter.toHttp(entity, userHttp);
        }),
      );

      // remove os nulos
      const filtered = data.filter(Boolean);

      return response.status(200).json({
        status: true,
        data: filtered,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Kima App User by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({
    status: 400,
    description: 'User not found or bad request',
    type: HttpErrorResponseDTO,
  })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      if (!entity) throw new BadRequestException('KimaAppUser not found');

      const user = await this.findUserByIdCase.execute(entity.userId);
      if (!user) throw new BadRequestException('User not found');

      const userHttp = UserAdapter.toHttp(user);
      const data = KimaAppUserAdapter.toHttp(entity, userHttp);

      return response.status(200).json({
        status: true,
        data,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Kima App User' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: HttpErrorResponseDTO,
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateKimaAppUserRequestDTO,
    @Res() response,
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data });
      if (!entity) throw new BadRequestException('KimaAppUser not found');

      const user = await this.findUserByIdCase.execute(entity.userId);
      if (!user) throw new BadRequestException('User not found');

      const userHttp = UserAdapter.toHttp(user);
      const result = KimaAppUserAdapter.toHttp(entity, userHttp);

      return response.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from '../../dto';
import { CreateUserUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiTags('User')
@Controller('user')
export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @ApiBody({ type: CreateUserDTO, description: 'required data to create user' })
  @ApiResponse({ status: 201, description: 'user created successfuly' })
  @ApiResponse({ status: 400, description: 'user already exists' })
  @Post('create')
  async create(@Body() data: CreateUserDTO, @Res() response) {
    const user = await this.useCase.execute(data);
    return response.status(201).json({
      status: true,
      message: 'user created successfuly',
      data: UserAdapter.toHttp(user),
    });
  }
}

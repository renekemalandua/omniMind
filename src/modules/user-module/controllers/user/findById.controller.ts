import { Param, Controller, Get, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FindUserByIdUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class FindUserByIdController {
  constructor(private readonly useCase: FindUserByIdUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiOkResponse({ description: 'should return a user' })
  @ApiResponse({ status: 404, description: 'user dont found' })
  @Get(':id')
  async findById(@Param('id') id: string, @Res() response) {
    const user = await this.useCase.execute(id);
    return response.status(200).json({
      status: true,
      data: UserAdapter.toHttp(user),
    });
  }
}

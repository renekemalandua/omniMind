import { Param, Controller, Get, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindUserByEmailUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class FindUserByEmailController {
  constructor(private readonly useCase: FindUserByEmailUseCase) {}

  @ApiParam({ name: 'email', type: 'string', description: 'user email' })
  @ApiOkResponse({ description: 'should return a user' })
  @ApiResponse({ status: 404, description: 'user dont found' })
  @Get('find-by-email/:email')
  async findByEmail(@Param('email') email: string, @Res() response) {
    const user = await this.useCase.execute(email);
    return response.status(200).json({
      status: true,
      data: UserAdapter.toHttp(user),
    });
  }
}

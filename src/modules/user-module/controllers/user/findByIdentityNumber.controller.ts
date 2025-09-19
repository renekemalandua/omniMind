import { Param, Controller, Get, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FindUserByIdentityNumberUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class FindUserByIdentityNumberController {
  constructor(private readonly useCase: FindUserByIdentityNumberUseCase) {}

  @ApiParam({ name: 'identity', type: 'string', description: 'user identity number' })
  @ApiOkResponse({ description: 'should return a user' })
  @ApiResponse({ status: 404, description: 'user dont found' })
  @Get('find-by-identity/:identity')
  async findByIdentityNumber(@Param('identity') identity: string, @Res() response) {
    const user = await this.useCase.execute(identity);
    return response.status(200).json({
      status: true,
      data: UserAdapter.toHttp(user),
    });
  }
}

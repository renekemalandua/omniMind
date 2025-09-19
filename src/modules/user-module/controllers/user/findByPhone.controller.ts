import { Param, Controller, Get, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FindUserByPhoneUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class FindUserByPhoneController {
  constructor(private readonly useCase: FindUserByPhoneUseCase) {}

  @ApiParam({ name: 'phone', type: 'string', description: 'user phone number' })
  @ApiOkResponse({ description: 'should return a user' })
  @ApiResponse({ status: 404, description: 'user dont found' })
  @Get('find-by-phone/:phone')
  async findByphone(@Param('phone') phone: string, @Res() response) {
    const user = await this.useCase.execute(phone);
    return response.status(200).json({
      status: true,
      data: UserAdapter.toHttp(user),
    });
  }
}

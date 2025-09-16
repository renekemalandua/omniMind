import { Controller, Res, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { DeactivateUserUseCase } from '../../usecases';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class DeactivateUserController {
  constructor(private readonly useCase: DeactivateUserUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiOkResponse({ description: 'user deactivated successfuly' })
  @ApiResponse({ status: 400, description: 'User is already deactivate' })
  @Put('deactivate/:id')
  async deactivate(@Param('id') id: string, @Res() response) {
    await this.useCase.execute(id);
    return response
      .status(200)
      .json({ status: true, message: 'user deactivated successfuly' });
  }
}

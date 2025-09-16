import { Param, Controller, Put, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ActivateUserUseCase } from '../../usecases';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class ActivateUserController {
  constructor(private readonly useCase: ActivateUserUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiOkResponse({ description: 'user activated successfuly' })
  @ApiBadRequestResponse({ description: 'User is already active' })
  @Put('activate/:id')
  async activate(@Param('id') id: string, @Res() response) {
    await this.useCase.execute(id);
    return response
      .status(200)
      .json({ status: true, message: 'user activated successfuly' });
  }
}

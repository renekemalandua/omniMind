import { Param, Controller, Res, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { DeleteUserUseCase } from '../../usecases';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiOkResponse({ description: 'user delete successfuly' })
  @ApiResponse({ status: 404, description: 'user dont found' })
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() response) {
    await this.useCase.execute(id);
    return response
      .status(200)
      .json({ status: true, message: 'user delete successfuly' });
  }
}

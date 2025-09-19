import { Param, Controller, Res, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { RestoreUserUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class RestoreUserController {
  constructor(private readonly useCase: RestoreUserUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiOkResponse({ description: 'should restore and return a user' })
  @ApiResponse({ status: 404, description: 'user dont found' })
  @Patch('restore/:id')
  async restore(@Param('id') id: string, @Res() response) {
    const user = await this.useCase.execute(id);
    return response.status(200).json({
      message: 'User restored successfuly',
      status: true,
      data: UserAdapter.toHttp(user),
    });
  }
}

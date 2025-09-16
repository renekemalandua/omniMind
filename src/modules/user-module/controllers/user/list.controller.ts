import { Controller, Get, Res} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ListUserUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class ListUserController {
  constructor(private readonly useCase: ListUserUseCase) {}

  @ApiOkResponse({ description: 'should return all users' })
  @Get()
  async list(@Res() response) {
    const user = await this.useCase.execute();
    return response
      .status(200)
      .json({ status: true, data: user.map((user) => UserAdapter.toHttp(user)) });
  }
}

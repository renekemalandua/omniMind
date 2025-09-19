import { Controller, Get, Res} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ListDeletedUserUseCase } from '../../usecases';
import { UserAdapter } from '../../adapter';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class ListDeletedUserController {
  constructor(private readonly useCase: ListDeletedUserUseCase) {}

  @ApiOkResponse({ description: 'should return all deleted users' })
  @Get('list-deleted')
  async list(@Res() response) {
    const user = await this.useCase.execute();
    return response
      .status(200)
      .json({ status: true, data: user.map((user) => UserAdapter.toHttp(user)) });
  }
}

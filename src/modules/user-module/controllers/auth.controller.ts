import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginUseCase } from '../usecases';
import { AuthLoginDTO } from '../dto';
import { UserAdapter } from '../adapter';

@ApiTags('Auth')
@Controller('auth')
export class AuthUserController {
  constructor(private readonly useCase: AuthLoginUseCase) {}

  @ApiBody({ type: AuthLoginDTO, description: 'required data to auth user' })
  @ApiOkResponse({ description: 'user login done successfuly' })
  @ApiResponse({ status: 400, description: 'User or password dont match' })
  @Post('login')
  async auth(
    @Body() data: AuthLoginDTO,
    @Req() request,
    @Res() response,
  ) {
    const ipAddress = request.ip ?? "ip not found";
    const res = await this.useCase.execute({ ipAddress, data });
    return response.status(200).json({
      status: true,
      message: 'user login done successfuly',
      token: res.token,
      user: UserAdapter.toHttp(res.user),
    });
  }
}

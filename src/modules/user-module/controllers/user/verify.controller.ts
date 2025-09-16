import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { VerifyEmailUseCase } from '../../usecases';
import { verifyUserDTO } from '../../dto/verify.dto';

@ApiTags('User')
@Controller('user')
export class VerifyUserEmailController {
  constructor(private readonly useCase: VerifyEmailUseCase) {}

  @ApiBody({ type: verifyUserDTO, description: 'verify token' })
  @ApiOkResponse({
    description: 'Email verified successfuly',
  })
  @Post('verify')
  async verifyEmail(@Body() data: verifyUserDTO, @Res() response) {
    await this.useCase.execute(data.token);
    return response
      .status(200)
      .json({ status: true, message: 'Email verified successfuly' });
  }
}

import { Controller, Res, Post, Body, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResetPasswordUseCase } from '../../usecases';
import { ResetUserPasswordDTO } from '../../dto';

@ApiTags('User')
@Controller('user')
export class ResetPasswordController {
  constructor(private readonly useCase: ResetPasswordUseCase) {}

  @ApiBody({ type: ResetUserPasswordDTO, description: 'user email' })
  @ApiOkResponse({ description: 'email reseted successfuly' })
  @Post('reset-password')
  async resetPassword(
    @Body() data: ResetUserPasswordDTO,
    @Res() response,
    @Req() request,
  ) {
    const ipAddress = request.ip;
    await this.useCase.execute(data.email);
    return response.status(200).json({
      status: true,
      message: 'password reseted successfuly',
    });
  }
}

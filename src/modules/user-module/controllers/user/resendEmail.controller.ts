import { Controller, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ResendUserEmailDTO } from '../../dto';
import { ResendEmailUseCase } from '../../usecases';

@ApiTags('User')
@Controller('user')
export class ResendEmailController {
  constructor(private readonly useCase: ResendEmailUseCase) {}

  @ApiBody({ type: ResendUserEmailDTO, description: 'user email' })
  @ApiOkResponse({ description: 'email resended successfuly' })
  @Post('resend-email')
  async resendEmail(
    @Body() data: ResendUserEmailDTO,
    @Res() response,
  ) {
    await this.useCase.execute(data.email);
    return response.status(200).json({
      status: true,
      message: 'email resended successfuly',
    });
  }
}

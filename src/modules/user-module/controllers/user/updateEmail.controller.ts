import {
  Param,
  Controller,
  Res,
  UseGuards,
  Put,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UpdateUserEmailUseCase } from '../../usecases';
import { UpdateEmailDTO } from '../../dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UpdateUserEmailController {
  constructor(private readonly useCase: UpdateUserEmailUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiBody({ type: UpdateEmailDTO, description: 'new email' })
  @ApiOkResponse({
    description: 'user email updated successfuly',
  })
  @Put('update-email/:id')
  async updateEmail(
    @Param('id') id: string,
    @Body() data: UpdateEmailDTO,
    @Res() response,
    @Req() request,
  ) {
    const ipAddress = request.ip;
    await this.useCase.execute(data);
    return response.status(200).json({
      status: true,
      message: 'user email updated successfuly',
    });
  }
}

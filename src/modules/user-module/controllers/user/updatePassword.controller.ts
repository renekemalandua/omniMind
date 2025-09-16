import {
  Param,
  Controller,
  Res,
  Put,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserPasswordUseCase } from '../../usecases';
import { UpdatePasswordDTO } from '../../dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UpdateUserPasswordController {
  constructor(private readonly useCase: UpdateUserPasswordUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiBody({ type: UpdatePasswordDTO, description: 'last and new password' })
  @ApiOkResponse({
    description: 'user password updated successfuly',
  })
  @Put('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() data: UpdatePasswordDTO,
    @Res() response,
    @Req() request,
  ) {
    const ipAddress = request.ip;
    await this.useCase.execute(data);
    return response.status(200).json({
      status: true,
      message: 'user password updated successfuly',
    });
  }
}

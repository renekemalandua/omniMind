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
import { UpdateUserPhoneUseCase } from '../../usecases';
import { UpdatePhoneDTO } from '../../dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UpdateUserPhoneController {
  constructor(private readonly useCase: UpdateUserPhoneUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiBody({ type: UpdatePhoneDTO, description: 'new phone number' })
  @ApiOkResponse({
    description: 'user phone number updated successfuly',
  })
  @Put('update-phone-number/:id')
  async updatePhone(
    @Param('id') id: string,
    @Body() data: UpdatePhoneDTO,
    @Res() response,
    @Req() request,
  ) {
    const ipAddress = request.ip;
    await this.useCase.execute({id, newPhone: data.newPhone});
    return response.status(200).json({
      status: true,
      message: 'user phone number updated successfuly',
    });
  }
}

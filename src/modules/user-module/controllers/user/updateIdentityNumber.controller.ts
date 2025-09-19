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
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UpdateUserIdentityNumberUseCase } from '../../usecases';
import { UpdateIdentityNumberDTO } from '../../dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UpdateUserIdentityNumberController {
  constructor(private readonly useCase: UpdateUserIdentityNumberUseCase) {}

  @ApiParam({ name: 'id', type: 'string', description: 'user ID' })
  @ApiBody({ type: UpdateIdentityNumberDTO, description: 'new identity number' })
  @ApiOkResponse({
    description: 'user identity number updated successfuly',
  })
  @Put('update-identity-number/:id')
  async updateIdentityNumber(
    @Param('id') id: string,
    @Body() data: UpdateIdentityNumberDTO,
    @Res() response,
    @Req() request,
  ) {
    const ipAddress = request.ip;
    await this.useCase.execute({id, indentityNumber: data.indentityNumber});
    return response.status(200).json({
      status: true,
      message: 'user identity number updated successfuly',
    });
  }
}

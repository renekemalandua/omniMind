import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HttpErrorResponseDTO } from '../../../shared';
import { UserAdapter } from '../../user-module/adapter/user.adapter';
import { LarAngolaUserAdapter } from '../adapter';
import { RegisterLarAngolaUserRequestDTO } from '../dto';
import { RegisterLarAngolaUserUseCase } from '../usecases';

@ApiTags('LarAngola - Registration')
@Controller('lar-angola/register')
export class LarAngolaRegisterController {
	constructor(private readonly registerUseCase: RegisterLarAngolaUserUseCase) { }

	@Post()
	@ApiOperation({ summary: 'Register user and LarAngola profile' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async handle(@Body() body: RegisterLarAngolaUserRequestDTO, @Res() response) {
		try {
			const result = await this.registerUseCase.execute(body);

			return response.status(201).json({
				status: true,
				message: 'LarAngola user registered successfully',
				data: {
					user: UserAdapter.toHttp(result.user),
					larAngolaUser: LarAngolaUserAdapter.toHttp(result.larAngolaUser),
				},
			});
		} catch (error) {
			throw new BadRequestException(error.message ?? error);
		}
	}
}









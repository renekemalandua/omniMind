import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../../../shared';
import { CreateLarAngolaUserUseCase, DeleteLarAngolaUserUseCase, FindLarAngolaUserByIdUseCase, FindLarAngolaUserByUserIdUseCase, ListLarAngolaUsersUseCase, UpdateLarAngolaUserUseCase, SubmitVerificationUseCase } from '../usecases/lar-angola-user.usecases';
import { CreateLarAngolaUserRequestDTO, UpdateLarAngolaUserRequestDTO, SubmitVerificationRequestDTO } from '../dto/lar-angola-user.dto';
import { LarAngolaUserAdapter } from '../adapter/lar-angola-user.adapter';

@ApiTags('LarAngola - Users')
@Controller('lar-angola/users')
export class LarAngolaUserController {
	constructor(
		private readonly createUseCase: CreateLarAngolaUserUseCase,
		private readonly updateUseCase: UpdateLarAngolaUserUseCase,
		private readonly deleteUseCase: DeleteLarAngolaUserUseCase,
		private readonly listUseCase: ListLarAngolaUsersUseCase,
		private readonly findByIdUseCase: FindLarAngolaUserByIdUseCase,
		private readonly findByUserIdUseCase: FindLarAngolaUserByUserIdUseCase,
		private readonly submitVerificationUseCase: SubmitVerificationUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new LarAngolaUser' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateLarAngolaUserRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			return response.status(201).json({ status: true, data: LarAngolaUserAdapter.toHttp(entity) });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update LarAngolaUser' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateLarAngolaUserRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			return response.status(200).json({ status: true, data: LarAngolaUserAdapter.toHttp(entity) });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'Find LarAngolaUser by User ID' })
	@ApiParam({ name: 'userId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findByUserId(@Param('userId') userId: string, @Res() response) {
		try {
			const entity = await this.findByUserIdUseCase.execute(userId);
			return response.status(200).json({ status: true, data: LarAngolaUserAdapter.toHttp(entity!) });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find LarAngolaUser by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			return response.status(200).json({ status: true, data: LarAngolaUserAdapter.toHttp(entity!) });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Get()
	@ApiOperation({ summary: 'List LarAngola users' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			return response.status(200).json({ status: true, data: entities.map(LarAngolaUserAdapter.toHttp) });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete LarAngolaUser' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'LarAngola user deleted successfully' } });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Post(':id/verification')
	@ApiOperation({ summary: 'Submit verification documents' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async submitVerification(@Param('id') id: string, @Body() body: SubmitVerificationRequestDTO, @Res() response) {
		try {
			const entity = await this.submitVerificationUseCase.execute({ id, data: body });
			return response.status(200).json({ status: true, data: LarAngolaUserAdapter.toHttp(entity) });
		} catch (error) { throw new BadRequestException(error.message); }
	}
}



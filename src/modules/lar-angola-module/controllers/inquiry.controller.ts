import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../../../shared';
import { CreateInquiryUseCase, DeleteInquiryUseCase, FindInquiryByIdUseCase, ListInquiriesByListingUseCase } from '../usecases';
import { CreateInquiryRequestDTO } from '../dto';
import { HttpBuilder } from '../utils';

@ApiTags('LarAngola - Inquiries')
@Controller('lar-angola/inquiries')
export class InquiryController {
	constructor(
		private readonly createUseCase: CreateInquiryUseCase,
		private readonly deleteUseCase: DeleteInquiryUseCase,
		private readonly listByListingUseCase: ListInquiriesByListingUseCase,
		private readonly findByIdUseCase: FindInquiryByIdUseCase,
		private readonly httpBuilder: HttpBuilder,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Inquiry' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateInquiryRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = await this.httpBuilder.buildInquiry(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Inquiry by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = await this.httpBuilder.buildInquiry(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Get('listing/:listingId')
	@ApiOperation({ summary: 'List Inquiries by Listing' })
	@ApiParam({ name: 'listingId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByListing(@Param('listingId') listingId: string, @Res() response) {
		try {
			const entities = await this.listByListingUseCase.execute(listingId);
			const data = await Promise.all(entities.map(e => this.httpBuilder.buildInquiry(e).catch(() => null)));
			return response.status(200).json({ status: true, data: data.filter(Boolean) });
		} catch (error) { throw new BadRequestException(error.message); }
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Inquiry' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Inquiry deleted successfully' } });
		} catch (error) { throw new BadRequestException(error.message); }
	}
}



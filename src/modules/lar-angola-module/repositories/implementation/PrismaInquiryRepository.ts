import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../shared';
import { IInquiryRepository } from '../IInquiryRepository';
import { InquiryEntity } from '../../entities';
import { InquiryAdapter } from '../../adapter';

@Injectable()
export class PrismaInquiryRepository implements IInquiryRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: InquiryEntity): Promise<InquiryEntity> {
		const raw = InquiryAdapter.toPrisma(data);
		const created = await this.prisma.inquiryLA.create({ data: raw });
		return InquiryAdapter.toDomain(created);
	}

	async listByListing(listingId: string): Promise<InquiryEntity[]> {
		const rows = await this.prisma.inquiryLA.findMany({ where: { listingId }, orderBy: { createdAt: 'desc' } });
		return rows.map(InquiryAdapter.toDomain);
	}

	async findById(id: string): Promise<InquiryEntity | null> {
		const row = await this.prisma.inquiryLA.findUnique({ where: { id } });
		return row ? InquiryAdapter.toDomain(row) : null;
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.inquiryLA.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Inquiry not found');
		await this.prisma.inquiryLA.delete({ where: { id } });
	}
}



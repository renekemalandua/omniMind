import { InquiryEntity } from "../entities";

export abstract class IInquiryRepository {
	abstract create(data: InquiryEntity): Promise<InquiryEntity>;
	abstract listByListing(listingId: string): Promise<InquiryEntity[]>;
	abstract findById(id: string): Promise<InquiryEntity | null>;
	abstract delete(id: string): Promise<void>;
}




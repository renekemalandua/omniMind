declare namespace HTTP {
	declare namespace User {
		type UserDetail = {
			id: string;
			email: string;
			phone: string;
			identity: string | null;
			verified: boolean;
			emailVerified: boolean;
			identityVerified: boolean;
			active: boolean;
			deletedAt: Date | null;
			createdAt: Date;
			updatedAt: Date;
		};

		type RegisterRequest = {
			email: string;
			phone: password;
			password: string;
		};

		type RegisterResponse = {
			confirmationToken: string;
			message: string;
			user: UserDetail;
		};

		type LoginRequest = {
			email: string;
			password: string;
			platform: string;
		};

		type LoginResponse = {
			token: string;
			user: UserDetail;
		};
	}

	declare namespace KimaApp {
		type KimaAppUserType = "farmer" | "company" | "driver" | "seller";
		type OrderStatus = "pending" | "in_transit" | "delivered" | "canceled";

		// ==== Farmer ====
		type FarmerUserResponse = {
			id: string;
			type: KimaAppUserType;
			name: string;
			image: string | null;
			nif: string | null;
			address: string | null;
			region: string | null;
			farmSize: number;
			createdAt: Date;
			updatedAt: Date;
			user: User.UserDetail;
		}

		// ==== Company ====
		type CompanyUserResponse = {
			id: string;
			type: KimaAppUserType;
			name: string;
			image: string | null;
			nif: string | null;
			address: string | null;
			region: string | null;
			companyType: string;
			createdAt: Date;
			updatedAt: Date;
			user: User.UserDetail;
		}

		// ==== Seller ====
		type SellerUserResponse = {
			id: string;
			type: KimaAppUserType;
			name: string;
			image: string | null;
			address: string | null;
			region: string | null;
			productsCarried: string;
			createdAt: Date;
			updatedAt: Date;
			user: User.UserDetail;
		}

		// ==== Driver ====
		type DriverUserResponse = {
			id: string;
			type: KimaAppUserType;
			name: string;
			image: string | null;
			address: string | null;
			region: string | null;
			vehicleType: string;
			licenseNumber: string;
			createdAt: Date;
			updatedAt: Date;
			user: User.UserDetail;
		}

		type ProductCategoryResponse = {
			id: string;
			name: string;
			description: string | null;
			createdAt: Date;
			updatedAt: Date;
			products: ProductResponse[];
		}

		type ProductResponse = {
			id: string;
			name: string;
			image: string | null;
			description: string | null;
			price: number;
			quantity: number;
			createdAt: Date;
			updatedAt: Date;

			owner: FarmerUserResponse;
			category: ProductCategoryResponse;
		}

		type OrderResponse = {
			id: string;
			status: OrderStatus;
			createdAt: Date;
			updatedAt: Date;

			product: Product;
			driver: DriverUserResponse | null;
			buyer: CompanyUserResponse | SellerUserResponse;
		}
	}

	declare namespace LarAngola {
		type LarAngolaUserRole = "intermediary" | "client" | "company";
		type VerificationStatus = "pending" | "approved" | "rejected";

		type UserResponse = {
			id: string;
			userId: string;
			role: LarAngolaUserRole;
			fullName: string;
			phone: string | null;
			city: string | null;
			preferences?: unknown | null;
			isVerified: boolean;
			verificationStatus: VerificationStatus;
			verificationData?: unknown | null;
			createdAt: Date;
			updatedAt: Date;
		};

		type PropertyCategoryResponse = {
			id: string;
			name: string;
			description: string | null;
			createdAt: Date;
			updatedAt: Date;
			properties: PropertyResponse[];
		};

		type PropertyResponse = {
			id: string;
			title: string;
			description: string | null;
			address: string | null;
			city: string | null;
			state: string | null;
			country: string | null;
			latitude: number | null;
			longitude: number | null;
			bedrooms: number | null;
			bathrooms: number | null;
			areaSqm: number | null;
			amenities: unknown | null;
			images: unknown | null;
			createdAt: Date;
			updatedAt: Date;
			owner: UserResponse;
			category: PropertyCategoryResponse;
		};

		type TransactionType = "rent" | "sale";
		type ListingStatus = "active" | "inactive";

		type ListingResponse = {
			id: string;
			transactionType: TransactionType;
			price: number;
			currency: string;
			status: ListingStatus;
			createdAt: Date;
			updatedAt: Date;
			property: PropertyResponse;
			owner: UserResponse;
		};

		type InquiryResponse = {
			id: string;
			name: string;
			email: string;
			phone: string | null;
			message: string;
			createdAt: Date;
			listingId: string;
			user: UserResponse | null;
		};
	}
}


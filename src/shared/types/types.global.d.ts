declare namespace HTTP 
{
  declare namespace User 
  {
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
      address: string | null;
      region: string | null;
      productsCarried: string;
      createdAt: Date;
      updatedAt: Date;
      user: User.UserDetail;
      orders: Order[];
    }

    // ==== Driver ====
    type DriverUserResponse = {
      id: string;
      type: KimaAppUserType;
      name: string;
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
      products: Product[];
    }

    type ProductResponse = {
      id: string;
      name: string;
      description: string | null;
      price: number;
      quantity: number;
      createdAt: Date;
      updatedAt: Date;

      owner: KimaAppUser;
      category: ProductCategory;
    }

    type OrderResponse = {
      id: string;
      status: OrderStatus;
      createdAt: Date;
      updatedAt: Date;

      product: Product;
      driver: KimaAppUser | null;
      buyer: KimaAppUser;
    }
  }
}


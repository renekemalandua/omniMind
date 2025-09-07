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
}

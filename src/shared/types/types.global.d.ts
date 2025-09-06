declare namespace HTTP {
  declare namespace User {
    type UserDetail = {
      id: string;
      email: string;
      phone: string;
      identity: string | null;
      verified: boolean;
      active: boolean;
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
      user: API.User.UserProfile;
    };

    type LoginRequest = {
      nickname: string;
      password: string;
    };

    type LoginResponse = {
      token: string;
      user: API.User.UserProfile;
    };
  }
}

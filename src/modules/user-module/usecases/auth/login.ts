import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtService, ICryptoService, UseCase, GLOBAL_CONFIG } from '../../../../shared';
import { AuthLoginDTO } from '../../dto';
import { IUserRepository } from '../../repositories';

@Injectable()
export class AuthLoginUseCase
  implements UseCase<{ ipAddress: string; data: AuthLoginDTO }, any>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly cryptoService: ICryptoService,
  ) {}

  async execute(request: { ipAddress: string; data: AuthLoginDTO }) {
    const user = await this.repository.findByEmail(request.data.email);
    if (!user)
      throw new BadRequestException('Email or password dont match');

    const matchPassword = await this.cryptoService.compare(user.password, request.data.password);
    if (!matchPassword)
      throw new BadRequestException('Email or password dont match');

    if (user.deletedAt)
      throw new BadRequestException('Email or password dont match');

    if (!user.isActive)
      throw new UnauthorizedException('User account is deactivated');

    const payload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      isActive: user.isActive,
    };

    if (!GLOBAL_CONFIG.jwtAuthExp || !GLOBAL_CONFIG.jwtAuthSecret)
      throw new BadRequestException('Undefined .env variables');
    
    const token = await this.jwtService.encrypt({
      payload,
      secret: GLOBAL_CONFIG.jwtAuthSecret,
      exp: GLOBAL_CONFIG.jwtAuthExp,
    });

    return { token, user };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../repositories';
import { GLOBAL_CONFIG, IJwtService, IMailService, UseCase } from '../../../../shared';

@Injectable()
export class ResendEmailUseCase implements UseCase<string, void> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly mailService: IMailService,
  ) { }
  async execute(email: string) {
    try {
      const user = await this.repository.findByEmail(email);

      if (!user)
        throw new BadRequestException('user dont found');

      if (!GLOBAL_CONFIG.jwtVerifyExp || !GLOBAL_CONFIG.jwtVerifySecret)
        throw new BadRequestException('Undefined .env variables');

      const VerifyToken = await this.jwtService.encrypt({
        payload: user.id,
        secret: GLOBAL_CONFIG.jwtVerifySecret,
        exp: GLOBAL_CONFIG.jwtVerifyExp,
      });

      const body = 'Precisa verificar o seu email pra poder logar! clique no link abaixo para confirmar o seu email';
      await this.mailService.send(user.email, body, VerifyToken);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

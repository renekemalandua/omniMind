import { BadRequestException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories';
import { GLOBAL_CONFIG, IJwtService, IMailService, UseCase } from '../../../shared';
import { UpdateEmailDTO } from '../dto';

@Injectable()
export class UpdateUserEmailUseCase
  implements UseCase<UpdateEmailDTO, void>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly mailService: IMailService,
  ) {}
  async execute(request: UpdateEmailDTO) {
    try {
      const user = await this.repository.findById(request.id);
      if (!user) 
        throw new BadRequestException('user dont found');

      await this.repository.updateEmail(request.newEmail, user.id);

      if (!GLOBAL_CONFIG.jwtVerifyExp || !GLOBAL_CONFIG.jwtVerifySecret)
        throw new BadRequestException('Undefined .env variables');

      const VerifyToken = await this.jwtService.encrypt({
        payload: user.id,
        secret: GLOBAL_CONFIG.jwtVerifySecret,
        exp: GLOBAL_CONFIG.jwtVerifyExp,
      });

      const body = 'O seu email foi actualizado com sucesso! clique no link abaixo para confirmar o seu email';
      await this.mailService.send(user.email, body, VerifyToken);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

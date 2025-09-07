import { BadRequestException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../repositories';
import { ICryptoService, IMailService, UseCase } from '../../../../shared';


@Injectable()
export class ResetPasswordUseCase
  implements UseCase<string, void>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly cryptoService: ICryptoService,
    private readonly mailService: IMailService,
  ) {}
  async execute(email: string ) {
    try {
      const user = await this.repository.findByEmail(email);

      if (!user)
        throw new BadRequestException('user dont found');

      const randomPassword = '123456';
      const hashPassword = await this.cryptoService.hash(randomPassword);

      await this.repository.updatePassword(hashPassword, user.id);
      await this.mailService.send(user.email, randomPassword);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

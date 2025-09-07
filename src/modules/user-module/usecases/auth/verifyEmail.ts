import { BadRequestException, Injectable } from '@nestjs/common';
import { GLOBAL_CONFIG, IJwtService, UseCase } from '../../../../shared';
import { IUserRepository } from '../../repositories';

@Injectable()
export class VerifyEmailUseCase implements UseCase<string, void> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) { }
  async execute(token: string) {
    try 
    {
      if (!GLOBAL_CONFIG.jwtVerifySecret)
        throw new BadRequestException('Undefined .env variables');

      const id = await this.jwtService.verify( token, GLOBAL_CONFIG.jwtVerifySecret);
      if (!id)
        throw new BadRequestException('this is a invalid token');

      const user = await this.repository.findById(id);
      if (!user)
        throw new BadRequestException('user dont found');
      await this.repository.verifyEmail(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared';
import { IUserRepository } from '../../repositories';

@Injectable()
export class VerifyIdentityUseCase implements UseCase<string, void> {
  constructor(
    private readonly repository: IUserRepository,
  ) { }
  async execute(id: string) {
    try 
    {
      const user = await this.repository.findById(id);
      if (!user)
        throw new BadRequestException('user dont found');
      await this.repository.verifyIdentity(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

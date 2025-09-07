import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IUserRepository } from '../repositories';
import { UserEntity } from '../entities';

@Injectable()
export class RestoreUserUseCase implements UseCase<string, UserEntity> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(id: string): Promise<UserEntity> {
    try {
      const user = await this.repository.findById(id);
      if (!user)
        throw new BadRequestException('user dont found');
      return (await this.repository.restore(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

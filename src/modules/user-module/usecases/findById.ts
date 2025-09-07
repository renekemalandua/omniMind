import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IUserRepository } from '../repositories';
import { UserEntity } from '../entities';

@Injectable()
export class FindUserByIdUseCase implements UseCase<string, UserEntity> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(id: string) {
    try {
      const user = await this.repository.findById(id);
      if (!user)
        throw new BadRequestException('user dont found');
      return (user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

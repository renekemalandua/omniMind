import { BadRequestException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories';
import { UseCase } from '../../../shared';
import { UserEntity } from '../entities';

@Injectable()
export class DeactivateUserUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(id: string) {
    try {
      const user = await this.repository.findById(id);
      if (!user)
        throw new BadRequestException('user dont found');

      if (!user.isActive)
        throw new BadRequestException('User is already deactive');

      await this.repository.deactivate(user.id);
      UserEntity.deactivateUser(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IUserRepository } from '../repositories';
import { UserEntity } from '../entities';

@Injectable()
export class ListUserUseCase implements UseCase<void, UserEntity[]> {
  constructor(private readonly repository: IUserRepository) {}

  async execute() {
    try {
      return (await this.repository.list());
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

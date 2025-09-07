import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IUserRepository } from '../repositories';

@Injectable()
export class DeleteUserUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IUserRepository) {}
  async execute(id: string): Promise<void> {
    try {
      const user = await this.repository.findById(id);
      if (!user)
        throw new BadRequestException('user dont found');
      
      await this.repository.delete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ICryptoService, UseCase } from '../../../shared';
import { UpdatePasswordDTO } from '../dto';
import { IUserRepository } from '../repositories';

@Injectable()
export class UpdateUserPasswordUseCase
  implements UseCase<UpdatePasswordDTO, void>
{
  constructor(
    private readonly repository: IUserRepository,
    private readonly cryptService: ICryptoService,
  ) {}
  async execute(request: UpdatePasswordDTO ) {
    try {
      const user = await this.repository.findById(request.id);
      if (!user)
        throw new BadRequestException('user dont found');

      const matchPassword = await this.cryptService.compare( user.password, request.lastPassword);
      if (!matchPassword)
        throw new BadRequestException('The last password dont match');

      const hashed = await this.cryptService.hash(request.newPassword);
      await this.repository.updatePassword(hashed, user.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

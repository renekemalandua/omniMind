import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { UpdatePhoneDTO } from '../dto';
import { IUserRepository } from '../repositories';

@Injectable()
export class UpdateUserPhoneUseCase
  implements UseCase<UpdatePhoneDTO, void>
{
  constructor(
    private readonly repository: IUserRepository,
  ) {}
  async execute(request: UpdatePhoneDTO ) {
    try {
      const user = await this.repository.findById(request.id);
      if (!user)
        throw new BadRequestException('user dont found');

      await this.repository.updatePhone(request.newPhone, user.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

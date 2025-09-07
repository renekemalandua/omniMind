import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IUserRepository } from '../repositories';
import { UpdateIdentityNumberDTO } from '../dto';

@Injectable()
export class UpdateUserIdentityNumberUseCase
  implements UseCase<UpdateIdentityNumberDTO, void>
{
  constructor(
    private readonly repository: IUserRepository,
  ) {}
  async execute(request: UpdateIdentityNumberDTO ) {
    try {
      const user = await this.repository.findById(request.id);
      if (!user)
        throw new BadRequestException('user dont found');
      await this.repository.updateIdentityNumber(request.indentityNumber, user.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

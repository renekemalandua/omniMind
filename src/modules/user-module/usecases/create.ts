import { BadRequestException, Injectable } from '@nestjs/common';
import { GLOBAL_CONFIG, ICryptoService, IJwtService, IMailService, UseCase } from '../../../shared';
import { IUserRepository } from '../repositories';
import { CreateUserDTO } from '../dto';
import { UserEntity } from '../entities';

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDTO, UserEntity> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cryptoService: ICryptoService,
    private readonly mailService: IMailService,
    private readonly jwtService: IJwtService,
  ) { }

  async execute(request: CreateUserDTO) {
    try {
      const userExist = await this.repository.find(request.email);

      if (userExist)
        throw new BadRequestException('user already exists');

      const hashPassword = await this.cryptoService.hash(request.password);
      const user = UserEntity.create({...request, password: hashPassword});

      if (!GLOBAL_CONFIG.jwtVerifyExp || !GLOBAL_CONFIG.jwtVerifySecret)
        throw new BadRequestException('Undefined .env variables');

      const VerifyToken = await this.jwtService.encrypt({
        payload: user.id,
        secret: GLOBAL_CONFIG.jwtVerifySecret,
        exp: GLOBAL_CONFIG.jwtVerifyExp,
      });

      const body = 'Conta criada com sucesso! clique no link abaixo para confirmar o seu email';
      await this.mailService.send(request.email, body, VerifyToken);
      return (await this.repository.create(user));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

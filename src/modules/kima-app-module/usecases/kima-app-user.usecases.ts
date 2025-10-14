import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { IKimaAppUserRepository } from '../repositories';
import { KimaAppUserEntity } from '../entities';
import { CreateKimaAppUserRequestDTO, UpdateKimaAppUserRequestDTO } from '../dto';

@Injectable()
export class CreateKimaAppUserUseCase implements UseCase<CreateKimaAppUserRequestDTO, KimaAppUserEntity> {
    constructor(private readonly repository: IKimaAppUserRepository) { }

    async execute(request: CreateKimaAppUserRequestDTO): Promise<KimaAppUserEntity> {
        try {
            const entity = KimaAppUserEntity.create(request);
            return await this.repository.create(entity);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

@Injectable()
export class ListKimaAppUsersUseCase implements UseCase<void, KimaAppUserEntity[]> {
    constructor(private readonly repository: IKimaAppUserRepository) { }

    async execute(): Promise<KimaAppUserEntity[]> {
        try {
            return await this.repository.list();
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

@Injectable()
export class FindKimaAppUserByIdUseCase implements UseCase<string, KimaAppUserEntity | null> {
    constructor(private readonly repository: IKimaAppUserRepository) { }

    async execute(id: string): Promise<KimaAppUserEntity | null> {
        const entity = await this.repository.findById(id);
        if (!entity) throw new BadRequestException('User not found');
        return entity;
    }
}

@Injectable()
export class UpdateKimaAppUserUseCase implements UseCase<{ id: string; data: UpdateKimaAppUserRequestDTO }, KimaAppUserEntity> {
    constructor(private readonly repository: IKimaAppUserRepository) { }

    async execute({ id, data }: { id: string; data: UpdateKimaAppUserRequestDTO }): Promise<KimaAppUserEntity> {
        try {
            const entity = await this.repository.findById(id);
            if (!entity) throw new BadRequestException('User not found');
            KimaAppUserEntity.update(entity, data);
            return await this.repository.update(entity);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

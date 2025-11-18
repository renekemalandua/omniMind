import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared';
import { LarAngolaUserEntity } from '../entities/lar-angola-user.entity';
import { ILarAngolaUserRepository } from '../repositories/ILarAngolaUserRepository';
import { CreateLarAngolaUserRequestDTO, UpdateLarAngolaUserRequestDTO, SubmitVerificationRequestDTO } from '../dto/lar-angola-user.dto';

@Injectable()
export class CreateLarAngolaUserUseCase implements UseCase<CreateLarAngolaUserRequestDTO, LarAngolaUserEntity> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute(request: CreateLarAngolaUserRequestDTO): Promise<LarAngolaUserEntity> {
		const exists = await this.repository.findByUserId(request.userId);
		if (exists) throw new BadRequestException('LarAngola user already exists for this userId');
		const entity = LarAngolaUserEntity.create(request as any);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateLarAngolaUserUseCase implements UseCase<{ id: string; data: UpdateLarAngolaUserRequestDTO }, LarAngolaUserEntity> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute({ id, data }: { id: string; data: UpdateLarAngolaUserRequestDTO }): Promise<LarAngolaUserEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('LarAngola user not found');
		if (data.role) (entity as any)['props'].role = data.role;
		if (data.fullName !== undefined) entity.fullName = data.fullName!;
		if (data.phone !== undefined) entity.phone = data.phone ?? null;
		if (data.city !== undefined) entity.city = data.city ?? null;
		if (data.preferences !== undefined) entity.preferences = data.preferences ?? null;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteLarAngolaUserUseCase implements UseCase<string, void> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('LarAngola user not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListLarAngolaUsersUseCase implements UseCase<void, LarAngolaUserEntity[]> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute(): Promise<LarAngolaUserEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class FindLarAngolaUserByIdUseCase implements UseCase<string, LarAngolaUserEntity | null> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute(id: string): Promise<LarAngolaUserEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('LarAngola user not found');
		return entity;
	}
}

@Injectable()
export class FindLarAngolaUserByUserIdUseCase implements UseCase<string, LarAngolaUserEntity | null> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute(userId: string): Promise<LarAngolaUserEntity | null> {
		const entity = await this.repository.findByUserId(userId);
		if (!entity) throw new BadRequestException('LarAngola user not found');
		return entity;
	}
}

@Injectable()
export class SubmitVerificationUseCase implements UseCase<{ id: string; data: SubmitVerificationRequestDTO }, LarAngolaUserEntity> {
	constructor(private readonly repository: ILarAngolaUserRepository) { }
	async execute({ id, data }: { id: string; data: SubmitVerificationRequestDTO }): Promise<LarAngolaUserEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('LarAngola user not found');

		// Verificar se já está verificado
		if (entity.isVerified && entity.verificationStatus === 'approved') {
			throw new BadRequestException('User is already verified');
		}

		// Atualizar dados de verificação
		entity.phone = data.phone;
		entity.verificationStatus = 'pending';
		entity.isVerified = false;
		entity.verificationData = {
			nif: data.nif,
			zonesOfOperation: data.zonesOfOperation,
			biFrente: data.biFrente,
			biVerso: data.biVerso,
			foto: data.foto,
			submittedAt: new Date().toISOString(),
		};

		return this.repository.update(entity);
	}
}

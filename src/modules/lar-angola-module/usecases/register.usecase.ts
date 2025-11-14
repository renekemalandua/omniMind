import { BadRequestException, Injectable } from '@nestjs/common';

import { UseCase } from '../../../shared';
import { CreateUserUseCase, DeleteUserUseCase } from '../../user-module/usecases';
import { LarAngolaUserEntity } from '../entities';
import { RegisterLarAngolaUserRequestDTO } from '../dto';
import { CreateLarAngolaUserUseCase } from './lar-angola-user.usecases';
import { UserEntity } from '../../user-module/entities';

type RegisterLarAngolaUserResult = {
	user: UserEntity;
	larAngolaUser: LarAngolaUserEntity;
};

@Injectable()
export class RegisterLarAngolaUserUseCase implements UseCase<RegisterLarAngolaUserRequestDTO, RegisterLarAngolaUserResult> {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase,
		private readonly createLarAngolaUserUseCase: CreateLarAngolaUserUseCase,
	) { }

	async execute(request: RegisterLarAngolaUserRequestDTO): Promise<RegisterLarAngolaUserResult> {
		const userEntity = await this.createUserUseCase.execute({
			email: request.email,
			phone: request.phone,
			password: request.password,
		});

		try {
			const preferences = this.buildPreferences(request);

			const larAngolaUserEntity = await this.createLarAngolaUserUseCase.execute({
				userId: userEntity.id,
				role: request.role,
				fullName: request.fullName,
				phone: request.phone,
				city: request.city,
				preferences,
			});

			return {
				user: userEntity,
				larAngolaUser: larAngolaUserEntity,
			};
		} catch (error) {
			await this.deleteUserUseCase.execute(userEntity.id);

			if (error instanceof BadRequestException) throw error;
			throw new BadRequestException(error);
		}
	}

	private buildPreferences(request: RegisterLarAngolaUserRequestDTO): unknown {
		const basePreferences: Record<string, unknown> = {
			frontendRole: request.role,
		};

		if (request.companyName) basePreferences.companyName = request.companyName;
		if (request.companyLocation) basePreferences.companyLocation = request.companyLocation;
		if (request.nif) basePreferences.nif = request.nif;

		if (request.preferences && typeof request.preferences === 'object') {
			return {
				...basePreferences,
				...(request.preferences as Record<string, unknown>),
			};
		}

		return {
			...basePreferences,
		};
	}
}



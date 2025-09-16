import { Module } from '@nestjs/common';
import { IUserRepository, PrismaUserRepository } from './repositories';
import { AuthUserController } from './controllers/auth.controller';
import { CreateUserController, ListUserController, VerifyUserEmailController, FindUserByEmailController, FindUserByIdController, UpdateUserPasswordController, UpdateUserEmailController, ResendEmailController, ResetPasswordController, ActivateUserController, DeactivateUserController, DeleteUserController } from './controllers/user';
import { AuthLoginUseCase, CreateUserUseCase, ListUserUseCase, FindUserByIdUseCase, FindUserByEmailUseCase, UpdateUserPasswordUseCase, UpdateUserEmailUseCase, VerifyEmailUseCase, ResendEmailUseCase, ResetPasswordUseCase, ActivateUserUseCase, DeactivateUserUseCase, DeleteUserUseCase } from './usecases';
import { ProviderModule } from '../../shared';


@Module({
    imports: [ProviderModule],
    controllers: [
        AuthUserController,
        CreateUserController,
        ListUserController,
        VerifyUserEmailController,
        FindUserByEmailController,
        FindUserByIdController,
        UpdateUserPasswordController,
        UpdateUserEmailController,
        ResendEmailController,
        ResetPasswordController,
        ActivateUserController,
        DeactivateUserController,
        DeleteUserController,
    ],
    providers: [
        {
            provide: IUserRepository,
            useClass: PrismaUserRepository,
        },
        AuthLoginUseCase,
        CreateUserUseCase,
        ListUserUseCase,
        FindUserByIdUseCase,
        FindUserByEmailUseCase,
        UpdateUserPasswordUseCase,
        UpdateUserEmailUseCase,
        VerifyEmailUseCase,
        ResendEmailUseCase,
        ResetPasswordUseCase,
        ActivateUserUseCase,
        DeactivateUserUseCase,
        DeleteUserUseCase,
    ],
    exports: [
        IUserRepository,
        CreateUserUseCase,
        ListUserUseCase,
        FindUserByIdUseCase,
        FindUserByEmailUseCase,
        UpdateUserPasswordUseCase,
        UpdateUserEmailUseCase,
        VerifyEmailUseCase,
        ResendEmailUseCase,
        ResetPasswordUseCase,
        ActivateUserUseCase,
        DeactivateUserUseCase,
        DeleteUserUseCase,
    ],
})
export class UserModule { }

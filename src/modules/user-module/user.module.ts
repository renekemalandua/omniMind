import { Module } from '@nestjs/common';
import { IUserRepository, PrismaUserRepository } from './repositories';
import { AuthUserController } from './controllers/auth.controller';
import { CreateUserController, ListUserController, VerifyUserEmailController, FindUserByEmailController, FindUserByIdController, UpdateUserPasswordController, UpdateUserEmailController, ResendEmailController, ResetPasswordController, ActivateUserController, DeactivateUserController, DeleteUserController, ListDeletedUserController, RestoreUserController, FindUserByIdentityNumberController, FindUserByPhoneController, UpdateUserIdentityNumberController, UpdateUserPhoneController } from './controllers/user';
import { AuthLoginUseCase, CreateUserUseCase, ListUserUseCase, FindUserByIdUseCase, FindUserByEmailUseCase, UpdateUserPasswordUseCase, UpdateUserEmailUseCase, VerifyEmailUseCase, ResendEmailUseCase, ResetPasswordUseCase, ActivateUserUseCase, DeactivateUserUseCase, DeleteUserUseCase, ListDeletedUserUseCase, RestoreUserUseCase, FindUserByIdentityNumberUseCase, FindUserByPhoneUseCase, UpdateUserIdentityNumberUseCase, UpdateUserPhoneUseCase } from './usecases';
import { ProviderModule } from '../../shared';

@Module({
    imports: [ProviderModule],
    controllers: [
        AuthUserController,
        CreateUserController,
        ListUserController,
        ListDeletedUserController,
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
        RestoreUserController,
        FindUserByIdentityNumberController,
        FindUserByPhoneController,
        UpdateUserIdentityNumberController,
        UpdateUserPhoneController,
    ],
    providers: [
        {
            provide: IUserRepository,
            useClass: PrismaUserRepository,
        },
        AuthLoginUseCase,
        CreateUserUseCase,
        ListUserUseCase,
        ListDeletedUserUseCase,
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
        RestoreUserUseCase,
        FindUserByIdentityNumberUseCase,
        FindUserByPhoneUseCase,
        UpdateUserIdentityNumberUseCase,
        UpdateUserPhoneUseCase,
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

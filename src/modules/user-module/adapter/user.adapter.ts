import { User } from "@prisma/client";
import { UserEntity } from "../entities";
import { IdValueObject } from '../../../shared';


export class UserAdapter {

    static toDomain(user: User): UserEntity {
        return UserEntity.create(
            {
                email: user.email,
                phone: user.phone,
                identityNumber: user.identityNumber,
                password: user.password,
                isActive: user.isActive,
                isVerified: user.isVerified,
                isEmailVerified: user.isEmailVerified,
                isIdentityVerified: user.isIdentityVerified,
                deletedAt: user.deletedAt,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt,
            },
            new IdValueObject(user.id),
        );
    }
    
    static toPrisma(user: UserEntity): User {
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            identityNumber: user.identityNumber,
            password: user.password,
            isActive: user.isActive,
            isVerified: user.isVerified,
            isEmailVerified: user.isEmailVerified,
            isIdentityVerified: user.isIdentityVerified,
            deletedAt: user.deletedAt,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        };
    }

    static toHttp(user: UserEntity): HTTP.User.UserDetail {
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            identity: user.identityNumber,
            active: user.isActive,
            verified: user.isVerified,
            emailVerified: user.isEmailVerified,
            identityVerified: user.isIdentityVerified,
            deletedAt: user.deletedAt,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        };
    }
}
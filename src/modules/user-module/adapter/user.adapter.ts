import { User } from "@prisma/client";
import { UserEntity } from "../entities";

export class UserAdapter {

    static toDomain(user: User): UserEntity {
        return UserEntity.create(
            {
                id: user.id,
                email: user.email,
                phone: user.phone,
                identityNumber: user.identityNumber ?? null,
                password: user.password,
                isActive: user.isActive,
                isVerified: user.isVerified,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt,
            },
        );
    }
    
    static toPrisma(user: UserEntity): User {
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            identityNumber: user.identityNumber ?? null,
            password: user.password,
            isActive: user.isActive,
            isVerified: user.isVerified,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        };
    }

    static toHttp(user: UserEntity): HTTP.User.UserDetail {
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            identity: user.identityNumber ?? null,
            active: user.isActive,
            verified: user.isVerified,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        };
    }
}
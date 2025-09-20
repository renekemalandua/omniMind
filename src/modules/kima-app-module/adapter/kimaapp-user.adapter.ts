import { KimaAppUser } from "@prisma/client";
import { KimaAppUserEntity } from "../entities";
import { IdValueObject } from '../../../shared';

export class KimaAppUserAdapter {

    static toDomain(user: KimaAppUser): KimaAppUserEntity {
        return KimaAppUserEntity.create(
            {
                userId: user.userId,
                type: user.type,
                name: user.name,
                nif: user.nif,
                address: user.address,
                region: user.region,
                farmSize: user.farmSize,
                companyType: user.companyType,
                vehicleType: user.vehicleType,
                licenseNumber: user.licenseNumber,
                productsCarried: user.productsCarried,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            new IdValueObject(user.id),
        );
    }

    static toPrisma(entity: KimaAppUserEntity): KimaAppUser {
        return {
            id: entity.id,
            userId: entity.userId,
            type: entity.type,
            name: entity.name,
            nif: entity.nif,
            address: entity.address,
            region: entity.region,
            farmSize: entity.farmSize,
            companyType: entity.companyType,
            vehicleType: entity.vehicleType,
            licenseNumber: entity.licenseNumber,
            productsCarried: entity.productsCarried,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toHttp(entity: KimaAppUserEntity, userDetail: HTTP.User.UserDetail): 
        HTTP.KimaApp.FarmerUserResponse | 
        HTTP.KimaApp.CompanyUserResponse | 
        HTTP.KimaApp.SellerUserResponse | 
        HTTP.KimaApp.DriverUserResponse 
    {
        switch (entity.type) {
            case "farmer":
                return {
                    id: entity.id,
                    type: "farmer",
                    name: entity.name,
                    nif: entity.nif,
                    address: entity.address,
                    region: entity.region,
                    farmSize: entity.farmSize!,
                    createdAt: entity.createdAt,
                    updatedAt: entity.updatedAt,
                    user: userDetail,
                };
            case "company":
                return {
                    id: entity.id,
                    type: "company",
                    name: entity.name,
                    nif: entity.nif,
                    address: entity.address,
                    region: entity.region,
                    companyType: entity.companyType!,
                    createdAt: entity.createdAt,
                    updatedAt: entity.updatedAt,
                    user: userDetail,
                };
            case "seller":
                return {
                    id: entity.id,
                    type: "seller",
                    name: entity.name,
                    address: entity.address,
                    region: entity.region,
                    productsCarried: entity.productsCarried!,
                    createdAt: entity.createdAt,
                    updatedAt: entity.updatedAt,
                    user: userDetail,
                };
            case "driver":
                return {
                    id: entity.id,
                    type: "driver",
                    name: entity.name,
                    address: entity.address,
                    region: entity.region,
                    vehicleType: entity.vehicleType!,
                    licenseNumber: entity.licenseNumber!,
                    createdAt: entity.createdAt,
                    updatedAt: entity.updatedAt,
                    user: userDetail,
                };
        }
    }
}

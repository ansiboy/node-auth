import "reflect-metadata";
import { EntityManager, Repository } from "typeorm";
import { Role, Category, Resource, User, UserLatestLogin, SMSRecord, Path, RoleResource, ResourcePath, UserRole } from "./entities";
import { ConnectionConfig } from "mysql";
export declare class PermissionDataContext {
    private entityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    users: Repository<User>;
    userRoles: Repository<UserRole>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    paths: Repository<Path>;
    roleResources: Repository<RoleResource>;
    resourcePaths: Repository<ResourcePath>;
    baseModuleResourceId: string;
    constructor(entityManager: EntityManager);
}
export declare function createDataContext(connConfig: ConnectionConfig): Promise<PermissionDataContext>;
export declare let permissionDataContext: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let currentUser: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let currentUserId: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;

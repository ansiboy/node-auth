import "reflect-metadata";
import { EntityManager, Repository } from "typeorm";
import { Role, Category, Resource, Token, User, UserLatestLogin, SMSRecord, Path, RoleResource } from "./entities";
export declare class AuthDataContext {
    private entityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    tokens: Repository<Token>;
    users: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    paths: Repository<Path>;
    roleResources: Repository<RoleResource>;
    constructor(entityManager: EntityManager);
    createTopButtonResource(args: {
        parentResourceId: string;
        name: string;
        className: string;
        icon: string;
        invokeMethodName: string;
        apiPaths: string[];
        showButtonText?: boolean;
        sort_number?: number;
    }): Promise<Resource>;
    dispose(): Promise<void>;
}
export declare function createDataContext(name?: string): Promise<AuthDataContext>;
export declare function initDatabase(): Promise<void>;

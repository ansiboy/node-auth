import "reflect-metadata";
import { EntityManager, Repository } from "typeorm";
import { Role, Category, Resource, Token, User, UserLatestLogin, SMSRecord } from "./entities";
export declare class AuthDataContext {
    private entityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    tokens: Repository<Token>;
    users: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    constructor(entityManager: EntityManager);
    dispose(): Promise<void>;
}
export declare let authDataContext: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function createDataContext(name?: string): Promise<AuthDataContext>;
export declare function initDatabase(): Promise<void>;

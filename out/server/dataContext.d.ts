import "reflect-metadata";
import { EntityManager, Repository } from "typeorm";
import { Role, Category, Resource, Token, User, UserLatestLogin } from "./entities";
export declare class AuthDataContext {
    private entityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    tokens: Repository<Token>;
    user: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;
    constructor(entityManager: EntityManager);
    dispose(): Promise<void>;
}
export declare let authDataContext: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function createDataContext(name?: string): Promise<AuthDataContext>;
export declare function initDatabase(): Promise<void>;

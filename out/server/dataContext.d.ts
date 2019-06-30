import "reflect-metadata";
import { EntityManager, Repository } from "typeorm";
import { Role, Application, Category, Resource } from "./entities";
export declare class AuthDataContext {
    private entityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    applications: Repository<Application>;
    resources: Repository<Resource>;
    constructor(entityManager: EntityManager);
    dispose(): Promise<void>;
}
export declare let authDataContext: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function createDataContext(): Promise<AuthDataContext>;

import "reflect-metadata";
import { EntityManager, Repository } from "typeorm";
import { Role, Application } from "./entities";
export declare class AuthDataContext {
    private entityManager;
    roles: Repository<Role>;
    applications: Repository<Application>;
    constructor(entityManager: EntityManager);
    dispose(): Promise<void>;
}
export declare let authDataContext: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function createDataContext(): Promise<AuthDataContext>;

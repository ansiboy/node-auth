import "reflect-metadata";
import { ConnectionConfig } from "mysql";
import { EntityManager, Repository } from "typeorm";
import { TokenData } from "./entities";
export interface SelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}
export interface SelectResult<T> {
    dataItems: T[];
    totalRowCount: number;
}
export declare class AuthDataContext {
    tokenDatas: Repository<TokenData>;
    entityManager: EntityManager;
    constructor(entityManager: EntityManager);
    static list<T>(repository: Repository<T>, options: {
        selectArguments?: SelectArguments;
        relations?: string[];
        fields?: Extract<keyof T, string>[];
    }): Promise<SelectResult<T>>;
}
export declare function createDataContext(connConfig: ConnectionConfig): Promise<AuthDataContext>;
export declare let authDataContext: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function createDatabaseIfNotExists(connConfig: ConnectionConfig): Promise<boolean>;

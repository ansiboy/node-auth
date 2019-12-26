import "reflect-metadata";
import { ConnectionConfig } from "mysql";
import { EntityManager, Repository } from "maishu-data";
import { TokenData, Role, UserRole } from "./entities";
import { Logger } from "maishu-node-mvc";
import { ServerContextData } from "./types";
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
    entityManager: EntityManager;
    tokenDatas: Repository<TokenData>;
    roles: Repository<Role>;
    userRoles: Repository<UserRole>;
    constructor(entityManager: EntityManager);
    static list<T>(repository: Repository<T>, options: {
        selectArguments?: SelectArguments;
        relations?: string[];
        fields?: Extract<keyof T, string>[];
    }): Promise<SelectResult<T>>;
    /**
 * 获取指定用户的角色 ID
 * @param userId 指定的用户 ID
 */
    static getUserRoleIds(userId: string, contextData: ServerContextData): Promise<string[]>;
}
export declare function createDataContext(contextData: ServerContextData): Promise<AuthDataContext>;
export declare let authDataContext: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function createDatabaseIfNotExists(connConfig: ConnectionConfig, initDatabase?: (conn: ConnectionConfig) => void, logger?: Logger): Promise<boolean>;
export declare function dataList<T>(repository: Repository<T>, options: {
    selectArguments?: SelectArguments;
    relations?: string[];
    fields?: Extract<keyof T, string>[];
}): Promise<SelectResult<T>>;
export declare function initDatabase(contextData: ServerContextData): Promise<void>;
export declare let currentUserId: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;

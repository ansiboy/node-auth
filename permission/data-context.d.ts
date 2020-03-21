import "reflect-metadata";
import { Repository, DataContext } from "maishu-node-data";
import { Category, Resource, User, UserLatestLogin, SMSRecord, ResourcePath } from "./entities";
import { ConnectionConfig } from "mysql";
export declare class PermissionDataContext extends DataContext {
    categories: Repository<Category>;
    resources: Repository<Resource>;
    users: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    resourcePaths: Repository<ResourcePath>;
    baseModuleResourceId: string;
    constructor(connConfig: ConnectionConfig);
}
export declare function createDataContext(connConfig: ConnectionConfig): Promise<PermissionDataContext>;
export declare let permissionDataContext: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let currentUser: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare let currentUserId: (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function initDatabase(db: ConnectionConfig): Promise<void>;

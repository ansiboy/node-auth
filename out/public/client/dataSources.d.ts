import { DataSource, DataSourceArguments } from "maishu-wuzhui";
import { Role } from "maishu-services-sdk";
import { Application } from "maishu-chitu-react";
export declare class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;
    constructor(params: DataSourceArguments<T> & {
        getItem?: (id: string) => Promise<T>;
    });
}
export declare function createRoleDataSource(app: Application): MyDataSource<Role>;

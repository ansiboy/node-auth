import { DataSource, DataSourceArguments } from "maishu-wuzhui";
import { Role } from "maishu-services-sdk";
export declare class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;
    constructor(params: DataSourceArguments<T> & {
        getItem?: (id: string) => Promise<T>;
    });
}
export declare function createMenuDataSource(): MyDataSource<any>;
export declare class DataSources {
    role: MyDataSource<Role>;
    menu: MyDataSource<any>;
}
export declare let dataSources: DataSources;

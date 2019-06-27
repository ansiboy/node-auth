import { DataSource, DataSourceArguments } from "maishu-wuzhui";
import { Role, MenuItem } from "maishu-services-sdk";
export declare class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;
    constructor(params: DataSourceArguments<T> & {
        getItem?: (id: string) => Promise<T>;
    });
}
export declare let dataSources: {
    role: MyDataSource<Role>;
    menu: MyDataSource<MenuItem>;
};

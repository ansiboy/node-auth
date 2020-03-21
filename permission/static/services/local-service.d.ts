import { Service } from "maishu-chitu-admin/static";
import { LocalValueStore } from "maishu-chitu-service";
import { DataSource } from "maishu-wuzhui";
import { LoginResult } from "gateway";
export declare enum DataSourceMethods {
    insert = 2,
    update = 4,
    delete = 8,
    all = 0
}
export declare class LocalService extends Service {
    loginInfo: LocalValueStore<any>;
    login(username: string, password: string): Promise<LoginResult>;
    dataSource<T extends ({
        id: string;
    })>(name: string, methods?: DataSourceMethods): DataSource<T>;
}

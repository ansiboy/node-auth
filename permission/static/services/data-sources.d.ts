import { DataSource } from "maishu-wuzhui";
import { WebsiteConfig } from "maishu-chitu-admin/static";
import { Resource } from "entities";
export declare type MenuItem = Resource & WebsiteConfig["menuItems"][0] & {
    parent?: MenuItem;
    roleNames?: string;
};
export declare let dataSources: {
    role: DataSource<any>;
    user: DataSource<any>;
    resource: DataSource<any>;
    token: DataSource<any>;
};

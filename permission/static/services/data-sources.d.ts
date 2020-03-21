import { DataSource } from "maishu-wuzhui";
import { WebsiteConfig } from "maishu-chitu-admin/static";
import { User, Resource } from "permission-entities";
import { TokenData, Role } from "gateway-entities";
export declare type MenuItem = Resource & WebsiteConfig["menuItems"][0] & {
    parent?: MenuItem;
    roleNames?: string;
};
export declare let dataSources: {
    role: DataSource<Role>;
    user: DataSource<User>;
    resource: DataSource<MenuItem>;
    token: DataSource<TokenData>;
};

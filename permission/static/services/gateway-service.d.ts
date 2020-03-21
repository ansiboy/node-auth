import { Service } from "maishu-chitu-service";
import { TokenData, Role } from "gateway-entities";
import { DataSourceSelectResult, DataSourceSelectArguments } from "maishu-wuzhui";
export declare class GatewayService extends Service {
    private url;
    menuItemList(): Promise<import("maishu-chitu-admin").SimpleMenuItem[]>;
    tokenList(args: DataSourceSelectArguments): Promise<DataSourceSelectResult<TokenData>>;
    roleList(args?: DataSourceSelectArguments): Promise<DataSourceSelectResult<Role>>;
    addRole(name: string, remark: string): Promise<{
        id: string;
    }>;
    addRole(item: Partial<Role>): Promise<{
        id: string;
    }>;
    updateRole(item: Partial<Role>): Promise<unknown>;
    myRoles(): Promise<Role[]>;
}

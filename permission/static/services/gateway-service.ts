import { Service } from "maishu-chitu-service";
import { WebsiteConfig } from "maishu-chitu-admin/static";
import { TokenData, Role } from "gatewayEntities";
import { DataSourceSelectArguments } from "maishu-services-sdk";
import { DataSourceSelectResult } from "maishu-wuzhui";

export class GatewayService extends Service {
    private url(path: string) {
        return `/auth/${path}`
    }

    async menuItemList() {
        let url = this.url("menuItem/list");
        let r = await this.get<WebsiteConfig["menuItems"]>(url);
        return r;
    }

    async tokenList(args: DataSourceSelectArguments) {
        let url = this.url("token/list");
        let r = await this.getByJson<DataSourceSelectResult<TokenData>>(url, { args });
        return r;
    }

    async roleList(args?: DataSourceSelectArguments) {
        let url = this.url("role/list");
        args = args || {};
        let r = await this.getByJson<DataSourceSelectResult<Role>>(url, { args });
        return r;
    }

    addRole(name: string, remark: string): Promise<{ id: string }>;
    addRole(item: Partial<Role>): Promise<{ id: string }>
    addRole(arg1: any, arg2?: string) {
        let url = this.url("role/add");

        let item: Partial<Role>;
        if (typeof arg1 == "string") {
            item = { name: arg1, remark: arg2 }
        }
        else {
            item = arg1;
        }
        return this.postByJson(url, { item })
    }

    updateRole(item: Partial<Role>) {
        let url = this.url("role/update");
        return this.postByJson(url, { item });
    }
}
import { Role, TokenData } from "gateway-entities";
import { Service } from "maishu-chitu-service";
import { WebsiteConfig } from "../website-config";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-wuzhui-helper";
import { Resource } from "permission-entities";
import { Station } from "gateway-entities";

export class GatewayService extends Service {

    private url(path: string) {
        return `auth/${path}`;
    }

    async myMenuItems() {
        let url = this.url("menuItem/my");
        let r = await this.get<WebsiteConfig["menuItems"]>(url);
        return r;
    }

    async menuItemList() {
        let url = this.url("menuItem/list");
        let r = await this.get<WebsiteConfig["menuItems"]>(url);
        return r;
    }

    async stationList() {
        let url = this.url("station/list");
        let r = await this.get<Station[]>(url);
        return r;
    }

    async addStation(item: Station) {
        let url = this.url("station/add");
        let r = await this.postByJson(url, { item });
        Object.assign(item, r);
        return item;
    }

    async removeStation(id: string) {
        let url = this.url("station/remove");
        let r = await this.postByJson(url, { id });
        return r;
    }
    myRoles() {
        let url = this.url("user/myRoles");
        return this.get<Role[]>(url);
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

    async resourceList() {
        let url = this.url("resource/list");
        let r = await this.getByJson<Resource[]>(url);
        return r;
    }

    async tokenList(args: DataSourceSelectArguments) {
        let url = this.url("token/list");
        let r = await this.getByJson<DataSourceSelectResult<TokenData>>(url, { args });
        return r;
    }

    logout() {
        let url = this.url("user/logout");
        return this.post<boolean>(url);
    }


}
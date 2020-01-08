import { WebsiteConfig, Service } from "maishu-chitu-admin/static";
import { TokenData, Role } from "gateway-entities";
import { DataSourceSelectResult, DataSourceSelectArguments } from "maishu-wuzhui";
import { ServiceModule } from "./service-module";

export class GatewayService extends Service {

    baseUrl = "/auth/";

    role = new RoleModule(this);
    user = new UserModule(this);

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


}

class RoleModule extends ServiceModule {
    async list(args?: DataSourceSelectArguments) {
        let url = this.url("role/list");
        args = args || {};
        let r = await this.getByJson<DataSourceSelectResult<Role>>(url, { args });
        return r;
    }

    add(name: string, remark: string): Promise<{ id: string }>;
    add(item: Partial<Role>): Promise<{ id: string }>
    add(arg1: any, arg2?: string) {
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

    update(item: Partial<Role>) {
        let url = this.url("role/update");
        return this.postByJson(url, { item });
    }

    remove(id: string) {
        let url = this.url("role/remove");
        return this.postByJson(url, { id });
    }
}

class UserModule extends ServiceModule {
    myRoles() {
        let url = this.url("user/myRoles");
        return this.get<Role[]>(url);
    }
    /** 获取指定用户的角色 */
    roles(userIds: string[]): Promise<Role[][]> {
        let url = this.url("user/roles");
        return this.getByJson<Role[][]>(url, { userIds });
    }
    setRoles(userId: string, roleids: string[]) {
        let url = this.url("user/setRoles");
        return this.postByJson(url, { userId, roleids });
    }
}
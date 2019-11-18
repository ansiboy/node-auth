import { Service } from "maishu-chitu-service";
import { WebsiteConfig } from "maishu-chitu-admin/static";
import { TokenData } from "gatewayEntities";
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
}
import { Service } from "maishu-chitu";
import websiteConfig = require("json!websiteConfig");

export class GatewayService extends Service {
    private url(path: string) {
        return `${location.protocol}//${websiteConfig.gateway}/auth/${path}`;
    }

    async myMenuItems() {
        let url = this.url("menuItem/my");
        let r = await this.get<typeof websiteConfig["menuItems"]>(url);
        return r;
    }

    async stationList() {
        let url = this.url("station/list");
        let r = await this.get<{ path: string }[]>(url);
        return r;
    }
}
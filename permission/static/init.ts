import { InitArguments } from "maishu-chitu-admin/static";
import { PageData } from "maishu-chitu";
import { PermissionService } from "./services/permission-service";
import websiteConfig = require("json!websiteConfig");

// PermissionService.baseUrl = `${websiteConfig.stationPath}`;

export default function init(args: InitArguments) {
    let showPage = args.app.showPage;
    args.app.showPage = function (pageUrl: string, args?: PageData, forceRender?: boolean) {
        args = args || {}
        let d = this.parseUrl(pageUrl)
        let names = ['login', 'forget-password', 'register']
        if (names.indexOf(d.pageName) >= 0) {
            args.container = 'simple'
        }

        return showPage.apply(this, [pageUrl, args, forceRender]);
    }
}
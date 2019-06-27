import { PermissionService } from "maishu-services-sdk";
import * as settings from "./settings";
import { Application } from "maishu-chitu-admin";

export let g: {
    app: Application,
} = window['chitu-admin-global'] = window['chitu-admin-global'] || {}

export default function (app: Application) {
    console.assert(app != null);
    g.app = app;

    requirejs(['css!site.css']);
    PermissionService.baseUrl = `http://${settings.gatewayHost}`;
}
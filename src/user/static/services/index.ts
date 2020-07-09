import { DataSource } from "maishu-wuzhui-helper";
import { PermissionService } from "./permission-service";
import { errorHandle, WebsiteConfig } from "maishu-chitu-admin/static";
import { User, Resource, } from "permission-entities";
import { TokenData, Role } from "gateway-entities";
// import { GatewayService } from "./gateway-service";

let ps = new PermissionService((err) => errorHandle(err));

export let services = {
    permission: ps,
    // gateway: gatewayService,
}
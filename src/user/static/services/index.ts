import { DataSource } from "maishu-wuzhui-helper";
import { PermissionService } from "./permission-service";
import { errorHandle, } from "../error-handle";
import { User, Resource, } from "permission-entities";
import { TokenData, Role } from "gateway-entities";
// import { GatewayService } from "./gateway-service";

let ps = new PermissionService((err) => errorHandle(err));

export let services = {
    permission: ps,
    // gateway: gatewayService,
}
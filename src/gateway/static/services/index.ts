import { GatewayService } from "./gateway-service"
import { errorHandle } from "maishu-chitu-admin/static"

let gatewayService = new GatewayService(err => errorHandle(err));
export let services = {
    gateway: gatewayService
}
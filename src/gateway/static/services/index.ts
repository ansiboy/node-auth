import { GatewayService } from "./gateway-service"
import { errorHandle } from "../error-handle";

let gatewayService = new GatewayService(err => errorHandle(err));
export let services = {
    gateway: gatewayService
}
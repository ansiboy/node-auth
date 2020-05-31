import { Settings as GatewaySettings, start as startGateway, roleIds as gatewayRoleIds } from "./gateway";
import { Settings as PermissionSettings, start as startPermission, roleIds as permissionRoleIds } from "./permission";

export let roleIds = Object.assign(gatewayRoleIds, permissionRoleIds);

type Settings = {
    gatewaySettings: GatewaySettings,
    permissionSettings: PermissionSettings,
}

export async function start(settings: Settings) {
    await startGateway(settings.gatewaySettings);
    startPermission(settings.permissionSettings);
    // startPortal(settings.portalSettings);
}
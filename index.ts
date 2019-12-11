import { Settings as GatewaySettings, start as startGateway, roleIds as gatewayRoleIds } from "./gateway";
import { Settings as PermissionSettings, start as startPermission, roleIds as permissionRoleIds } from "./permission";
import { Settings as PortalSettings, start as startPortal } from "./portal";

export let roleIds = Object.assign(gatewayRoleIds, permissionRoleIds);

type Settings = {
    gatewaySettings: GatewaySettings,
    permissionSettings: PermissionSettings,
    portalSettings: PortalSettings,
}

export async function start(settings: Settings) {
    await startGateway(settings.gatewaySettings);
    await startPermission(settings.permissionSettings);
    startPortal(settings.portalSettings);
}
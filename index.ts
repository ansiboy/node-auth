import { Settings as GatewaySettings, start as startGateway, roleIds as gatewayRoleIds } from "./gateway";
import { Settings as PermissionSettings, start as startPermission, roleIds as permissionRoleIds } from "./permission";
import { Settings as PortalSettings, start as startPortal } from "./portal";

export { createDatabaseIfNotExists } from "./gateway/data-context";

export let roleIds = Object.assign(gatewayRoleIds, permissionRoleIds);

type Settings = {
    gatewaySettings: GatewaySettings,
    permissionSettings: PermissionSettings,
    portalSettings: PortalSettings,
}

export async function start(settings: Settings) {
    await startGateway(settings.gatewaySettings);
    startPermission(settings.permissionSettings);
    startPortal(settings.portalSettings);
}
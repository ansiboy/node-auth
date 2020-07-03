import { Settings as GatewaySettings, start as startGateway, roleIds as gatewayRoleIds } from "./gateway";
import { Settings as PermissionSettings, start as startUser, roleIds as permissionRoleIds } from "./user";

export let roleIds = Object.assign(gatewayRoleIds, permissionRoleIds);

type Settings = {
    gatewaySettings: GatewaySettings,
    permissionSettings: PermissionSettings,
}

export async function start(settings: Settings) {
    let r1 = await startGateway(settings.gatewaySettings);
    let r2 = startUser(settings.permissionSettings);

    return { gateway: r1, user: r2 };
}
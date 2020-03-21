import { Settings as GatewaySettings } from "./gateway";
import { Settings as PermissionSettings } from "./permission";
import { Settings as PortalSettings } from "./portal";
export { createDatabaseIfNotExists } from "./gateway/data-context";
export declare let roleIds: {
    admin: string;
    anonymous: string;
    normalUser: string;
};
declare type Settings = {
    gatewaySettings: GatewaySettings;
    permissionSettings: PermissionSettings;
    portalSettings: PortalSettings;
};
export declare function start(settings: Settings): Promise<void>;

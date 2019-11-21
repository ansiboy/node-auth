declare type PermissionWebsiteConfig = import("maishu-chitu-admin").WebsiteConfig & {
    stationPath: string;
    gateway?: string;
    gatewayStaionPath: string;
    loginRedirectURL?: string;
};

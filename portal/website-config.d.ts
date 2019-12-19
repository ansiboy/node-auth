/// <reference path="declare.d.ts" />
import { PermissionConfig, WebsiteConfig } from "maishu-chitu-admin";
export declare let stationPath: string;
export declare let permissions: PermissionConfig;
export interface ServerContextData {
    indexPage: string;
}
export default function (data: ServerContextData): PortalWebsiteConfig & WebsiteConfig;

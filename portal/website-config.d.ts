/// <reference path="declare.d.ts" />
import { PermissionConfig, WebsiteConfig } from "maishu-chitu-admin";
export declare let stationPath: string;
export declare let permissions: PermissionConfig;
export default function (data: ServerContextData): PortalWebsiteConfig & WebsiteConfig;

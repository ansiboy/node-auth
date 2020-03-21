/// <reference path="declare.d.ts" />
import { WebsiteConfig } from "maishu-chitu-admin";
export declare let adminMobile: string;
export declare let adminPassword: any;
export declare type PermissionWebsiteConfig = {
    stationPath: string;
    gateway?: string;
    gatewayStaionPath: string;
    loginRedirectURL?: string;
} & WebsiteConfig;
declare let websiteConfig: PermissionWebsiteConfig;
export default websiteConfig;

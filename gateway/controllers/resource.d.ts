/// <reference types="node" />
import { WebsiteConfig } from "../types";
import http = require("http");
declare type MyMenuItem = WebsiteConfig["menuItems"][0] & {
    stationPath?: string;
};
export declare class ResourceController {
    list(req: http.IncomingMessage): Promise<MyMenuItem[]>;
    my(req: http.IncomingMessage, res: http.ServerResponse): Promise<MyMenuItem[]>;
}
export {};

/// <reference types="node" />
import { WebsiteConfig, ServerContext } from "../types";
import http = require("http");
declare type MyMenuItem = WebsiteConfig["menuItems"][0] & {
    stationPath?: string;
};
export declare class ResourceController {
    list(req: http.IncomingMessage, context: ServerContext): Promise<MyMenuItem[]>;
    my(req: http.IncomingMessage, res: http.ServerResponse, context: ServerContext): Promise<MyMenuItem[]>;
}
export {};

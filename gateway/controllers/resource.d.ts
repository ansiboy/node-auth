/// <reference types="node" />
import { ServerContext } from "../types";
import http = require("http");
export declare class ResourceController {
    list(req: http.IncomingMessage, context: ServerContext): Promise<any[]>;
    my(req: http.IncomingMessage, res: http.ServerResponse, context: ServerContext): Promise<any[]>;
}

/// <reference types="node" />
import http = require("http");
import { ServerContextData } from "./types";
export declare let socketMessages: {
    registerStation: string;
};
export declare function startSocketServer(server: http.Server, contextData: ServerContextData): void;

/// <reference types="node" />
import http = require("http");
export declare let socketMessages: {
    registerStation: string;
};
export declare function startSocketServer(server: http.Server): void;

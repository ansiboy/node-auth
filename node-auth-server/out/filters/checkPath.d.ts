/// <reference types="node" />
import http = require("http");
import { ActionResult } from 'maishu-node-mvc';
/**
 * 检查路径是否允许访问
 */
export declare function checkPath(req: http.IncomingMessage, res: http.ServerResponse): Promise<{
    errorResult: ActionResult;
}>;

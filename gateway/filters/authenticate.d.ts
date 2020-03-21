/// <reference types="node" />
import http = require("http");
import { ActionResult } from 'maishu-node-mvc';
import { PermissionConfig } from "../types";
/**
 * 检查路径是否允许访问
 */
export declare function authenticate(req: http.IncomingMessage, res: http.ServerResponse, permissions: PermissionConfig): Promise<ActionResult>;
export declare function getTokenData(req: http.IncomingMessage, res: http.ServerResponse): Promise<import("../entities").TokenData>;

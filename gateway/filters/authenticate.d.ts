/// <reference types="node" />
import http = require("http");
import { ActionResult } from 'maishu-node-mvc';
import { PermissionConfig, ServerContextData } from "../types";
/**
 * 检查路径是否允许访问
 */
export declare function authenticate(req: http.IncomingMessage, res: http.ServerResponse, permissions: PermissionConfig, contextData: ServerContextData): Promise<ActionResult>;
export declare function getTokenData(req: http.IncomingMessage, res: http.ServerResponse, contextData: ServerContextData): Promise<import("../entities").TokenData>;

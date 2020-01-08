/// <reference types="node" />
import http = require("http");
import { ActionResult } from 'maishu-node-mvc';
import { PermissionConfig, ServerContextData } from "../types";
/**
 * 检查路径是否允许访问
 */
export declare function authenticate(req: http.IncomingMessage, res: http.ServerResponse, permissions: PermissionConfig, contextData: ServerContextData): Promise<ActionResult>;
/**
 * 判断用户是否允许访问指定的路径
 * @param permissions 权限配置
 * @param userRoleIds 用户角色
 * @param pathname 指定的路径
 */
export declare function isAllowVisit(permissions: PermissionConfig, userRoleIds: string[], pathname: string): boolean;
export declare function getTokenData(req: http.IncomingMessage, res: http.ServerResponse, contextData: ServerContextData): Promise<import("../entities").TokenData>;

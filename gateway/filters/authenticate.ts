import http = require("http");
import url = require("url");
import querystring = require('querystring');
import { ActionResult, ContentResult, getLogger } from 'maishu-node-mvc';
import { errors } from "../errors";
import { PermissionConfig, PermissionConfigItem, ServerContextData } from "../types";
import { g, constants, roleIds } from "../global";
import Cookies = require("maishu-cookies");
import { TokenManager } from "../token";
import UrlPattern = require("url-pattern");
import { statusCodes } from "../status-codes";
import { Role } from "../entities";

/**
 * 检查路径是否允许访问
 */
export async function authenticate(req: http.IncomingMessage, res: http.ServerResponse,
    permissions: PermissionConfig, contextData: ServerContextData): Promise<ActionResult> {

    let logger = getLogger(g.projectName, contextData.logLevel);

    permissions = permissions || {};

    let userId: string = null;
    let userRoleIds: string[] = [roleIds.anonymous];// 所有访问者都拥有 anonymousRoleId 角色
    let tokenData = await getTokenData(req, res, contextData);
    if (tokenData) {
        userId = tokenData.user_id;
        let ids = await Role.getUserRoleIds(userId, contextData);
        if (ids) {
            userRoleIds.push(...ids);
        }

        //=========================================================
        // 所有注册用户都拥有 normalUser 角色
        if (userRoleIds.indexOf(roleIds.normalUser) < 0) {
            userRoleIds.push(roleIds.normalUser);
        }
        //=========================================================

        //tokenData.roleIds ? tokenData.roleIds.split(",") : [];
        // if (tokenData.role_ids) {
        //     userRoleIds.push(...tokenData.role_ids);
        // }
    }

    //==================================================
    // 管理员拥有所有权限
    if (userRoleIds.indexOf(roleIds.admin) >= 0) {
        logger.info(`Role is admin role.`);
        return null;
    }
    //==================================================
    let u = url.parse(req.url);

    //==================================================
    // 检查通过配置设置的权限
    let paths = Object.getOwnPropertyNames(permissions);
    for (let i = 0; i < paths.length; i++) {
        var pattern = new UrlPattern(paths[i]);
        if (pattern.match(u.pathname)) {
            let permissionItem = permissions[paths[i]] || {} as PermissionConfigItem;
            permissionItem.roleIds = permissionItem.roleIds || [];
            for (let userRoleId of userRoleIds) {
                if (permissionItem.roleIds.indexOf(userRoleId) >= 0)
                    return null;
            }

        }
    }
    //==================================================

    let error = userId == null ? errors.userNotLogin(req.url) : errors.forbidden(u.pathname);
    let result = new ContentResult(JSON.stringify(error), "application/json; charset=utf-8", statusCodes.noPermission);
    logger.info(`Current user role is:`, userRoleIds);
    logger.warn(error);
    return result;
}

export async function getTokenData(req: http.IncomingMessage, res: http.ServerResponse, contextData: ServerContextData) {
    let routeData = getQueryObject(req);
    let cookies = new Cookies(req, res);

    let tokenText = (req.headers['token'] as string) || routeData["token"] || cookies.get(constants.cookieToken);
    if (!tokenText)
        return null;

    let tokenData = await TokenManager.parse(tokenText, contextData);
    return tokenData;
}

/**
 * 
 * @param request 获取 QueryString 里的对象
 */
function getQueryObject(request: http.IncomingMessage): { [key: string]: any } {
    let contentType = request.headers['content-type'] as string;
    let obj: { [key: string]: any } = {};
    let urlInfo = url.parse(request.url || '');
    let { query } = urlInfo;

    if (!query) {
        return obj;
    }

    query = decodeURIComponent(query);
    let queryIsJSON = (contentType != null && contentType.indexOf('application/json') >= 0) ||
        (query != null && query[0] == '{' && query[query.length - 1] == '}')

    if (queryIsJSON) {
        let arr = (request.url || '').split('?');
        let str = arr[1]
        if (str != null) {
            str = decodeURIComponent(str);
            obj = JSON.parse(str);  //TODO：异常处理
        }
    }
    else {
        obj = querystring.parse(query);
    }

    return obj;
}



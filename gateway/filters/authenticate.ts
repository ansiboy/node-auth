import http = require("http");
import url = require("url");
import querystring = require('querystring');
import { ActionResult, ContentResult, getLogger } from 'maishu-node-mvc';
import { errors } from "../errors";
import { PermissionConfig, PermissionConfigItem } from "../types";
import { g, constants } from "../global";
import Cookies = require('cookies');
import { TokenManager } from "../token";
import UrlPattern = require("url-pattern");
import { statusCodes } from "../status-codes";

/**
 * 检查路径是否允许访问
 */
export async function authenticate(req: http.IncomingMessage, res: http.ServerResponse,
    permissions: PermissionConfig): Promise<ActionResult> {

    let logger = getLogger(g.projectName, g.settings.logLevel);

    permissions = permissions || {};

    let userId: string = null;
    let userRoleIds: string[] = [constants.anonymousRoleId];// 所有用户都拥有 anonymousRoleId 角色
    let token = await getToken(req, res);
    if (token) {
        let tokenData = await TokenManager.parse(token);
        if (tokenData) {
            userId = tokenData.userId;
            // userRoleIds = tokenData.roleIds ? tokenData.roleIds.split(",") : [];
            if (tokenData.roleIds) {
                userRoleIds.push(...tokenData.roleIds.split(","));
            }
        }
    }

    //==================================================
    // 管理员拥有所有权限
    if (userRoleIds.indexOf(constants.adminRoleId) >= 0) {
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
    console.warn(error);
    return result;
}

export function getToken(req: http.IncomingMessage, res: http.ServerResponse) {
    let routeData = getQueryObject(req);
    let cookies = new Cookies(req, res);

    let tokenText = (req.headers['token'] as string) || routeData["token"] || cookies.get(constants.cookieToken);
    return tokenText;
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



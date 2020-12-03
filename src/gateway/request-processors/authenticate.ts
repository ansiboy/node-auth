import url = require("url");
import { getLogger, RequestProcessor, RequestContext, RequestResult } from 'maishu-node-mvc';
import { errors } from "../errors";
import { PermissionConfig, PermissionConfigItem } from "../types";
import { g, roleIds } from "../global";
import UrlPattern = require("url-pattern");
import { StatusCode } from "../status-codes";
import { Role } from "../entities";
import { getTokenData } from "../filters/authenticate";



export class AuthenticateRequestProcessor implements RequestProcessor {

    #config: PermissionConfig;

    constructor(config?: PermissionConfig) {
        this.#config = config || {};
    }

    async execute(args: RequestContext): Promise<RequestResult> {
        let logger = getLogger(g.projectName, g.settings.logLevel);

        let permissions = this.#config;

        let userId: string = null;
        let userRoleIds: string[] = [roleIds.anonymous];// 所有访问者都拥有 anonymousRoleId 角色
        let tokenData = await getTokenData(args.req, args.res);
        if (tokenData) {
            userId = tokenData.user_id;
            let ids = await Role.getUserRoleIds(userId);
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
        let u = url.parse(args.req.url);

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

        let error = userId == null ? errors.userNotLogin(args.req.url) : errors.forbidden(u.pathname);
        let result: RequestResult = {
            content: JSON.stringify(error),
            headers: { "Content-Type": "application/json; charset=utf-8" },
            statusCode: StatusCode.NoPermission
        };
        logger.info(`Current user role is:`, userRoleIds);
        logger.warn(error);
        return result;
    }
}
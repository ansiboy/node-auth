import http = require("http");
import url = require("url");
import { ActionResult, ContentResult } from 'maishu-node-mvc';
import { createDataContext } from "../data-context";
import { Path, RoleResource, Resource, ResourceData, ResourcePath } from "../entities";
import { errorStatusCodes, errorNames, errors } from "../errors";
import { getUserIdFromRequest } from "../decorators";
import { constants } from "../common";
import UrlPattern = require("url-pattern");
import { settings } from "maishu-services-sdk";
import { conn } from "../settings";

let allPaths: Path[];

export interface PermissionConfig {
    [path: string]: PermissionConfigItem
}

export interface PermissionConfigItem {
    roleIds: string[]
}

/**
 * 检查路径是否允许访问
 */
export async function authenticate(req: http.IncomingMessage, res: http.ServerResponse,
    permissions: PermissionConfig): Promise<ActionResult> {

    permissions = permissions || {};
    let dc = await createDataContext(conn.auth);

    if (!allPaths) {
        allPaths = await dc.paths.find({ relations: ["resource"] });
    }

    let u = url.parse(req.url);

    let roleId: string = null;
    let userId = await getUserIdFromRequest(req, res);
    if (userId) {
        let user = await dc.users.findOne({
            where: { id: userId },
            select: ["role_id"]
        })

        if (user != null)
            roleId = user.role_id;
    }

    roleId = roleId || constants.anonymousRoleId;

    if (roleId == constants.adminRoleId)
        return null;

    //==================================================
    // 检查通过配置设置的权限
    let paths = Object.getOwnPropertyNames(permissions);
    for (let i = 0; i < paths.length; i++) {
        var pattern = new UrlPattern(paths[i]);
        if (pattern.match(u.pathname)) {
            let obj = permissions[paths[i]] || {} as PermissionConfigItem;
            let roleIds = obj.roleIds || [];
            if (roleIds.indexOf(roleId) >= 0)
                return null;

        }
    }
    //==================================================

    let [allResources, allRoleResources, allResourcePaths] = await Promise.all([dc.resources.find(), dc.roleResources.find(), dc.resourcePaths.find()]);
    for (let i = 0; i < allPaths.length; i++) {
        if (!allPaths[i].value)
            continue;

        var pattern = new UrlPattern(allPaths[i].value);
        if (pattern.match(u.pathname)) {
            let roleIds = getAllowVisitRoleIds(allResources, allRoleResources, allResourcePaths, allPaths[i]);
            if (roleIds.indexOf(roleId) >= 0 || roleIds.indexOf(constants.anonymousRoleId) >= 0)
                return null;
        }
    }

    let error = roleId == constants.anonymousRoleId ? errors.userNotLogin() : errors.forbidden(u.pathname);
    error.name = errorNames.noPermission;
    let result = new ContentResult(JSON.stringify(error), "application/json; charset=utf-8", errorStatusCodes.noPermission);
    console.warn(error);
    return result;

}

/**
 * 获取运行访问该路径的角色
 * @param path 路径
 */
function getAllowVisitRoleIds(allResources: Resource[], roleResources: RoleResource[], resourcePaths: ResourcePath[], path: Path) {
    let myResources = translateResources(allResources, roleResources);
    let resourceIds = resourcePaths.filter(o => o.path_id == path.id).map(o => o.resource_id);
    let roleIds: string[] = [];
    myResources.filter(a => resourceIds.indexOf(a.id) >= 0)
        .map(o => o.roleIds).forEach(o => roleIds.push(...o));

    return roleIds;
}



type MyResource = {
    id: string,
    name: string;
    parentId: string,
    parent: MyResource,
    children: MyResource[],
    roleIds: string[],
}


function translateResources(resources: Resource[], roleResources: RoleResource[]) {
    let myResources: MyResource[] = resources.map(o => ({
        id: o.id, parentId: o.parent_id, name: o.name,
        roleIds: roleResources.filter(r => r.resource_id == o.id).map(r => r.role_id)
    } as MyResource));

    for (let i = 0; i < myResources.length; i++) {
        if (myResources[i].parentId) {
            myResources[i].parent = myResources.filter(o => o.id == myResources[i].parentId)[0]
            myResources[i].children = myResources.filter(o => o.parentId == myResources[i].id);
        }
    }

    // 父资源的角色可以访问子资源，所以要把父角色加入到子资源的角色中去

    myResources.forEach(myResource => {
        console.assert(myResource.roleIds != null);
        let p = myResource.parent;
        while (p) {
            myResource.roleIds.push(...p.roleIds);
            p = p.parent;
        }
    })

    myResources.forEach(myResource => {
        // 去除重复元素
        myResource.roleIds = myResource.roleIds.filter((value, index, self) => {
            return self.indexOf(value) === index;
        })
    })

    return myResources;
}


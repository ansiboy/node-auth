"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const maishu_node_mvc_1 = require("maishu-node-mvc");
const dataContext_1 = require("../dataContext");
const errors_1 = require("../errors");
const decorators_1 = require("../decorators");
const common_1 = require("../common");
let allPaths;
/**
 * 检查路径是否允许访问
 */
function checkPath(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dc = yield dataContext_1.getDataContext();
        if (!allPaths) {
            allPaths = yield dc.paths.find({ relations: ["resource"] });
        }
        let u = url.parse(req.url);
        let path = allPaths.filter(o => o.value == u.pathname)[0];
        let roleId = null;
        let userId = yield decorators_1.getUserIdFromRequest(req);
        if (userId) {
            let user = yield dc.users.findOne({
                where: { id: userId },
                select: ["role_id"]
            });
            roleId = user.role_id;
        }
        roleId = roleId || common_1.constants.anonymousRoleId;
        if (roleId == common_1.constants.adminRoleId)
            return { errorResult: null };
        if (path != null) {
            let [allResources, roleResources, resourcePaths] = yield Promise.all([dc.resources.find(), dc.roleResources.find(), dc.resourcePath.find()]);
            let myResources = translateResources(allResources, roleResources);
            let resourceIds = resourcePaths.filter(o => o.path_id == path.id).map(o => o.resource_id);
            let roleIds = myResources.filter(a => resourceIds.indexOf(a.id) >= 0).map(o => o.roleIds)[0];
            if (roleIds.indexOf(roleId) >= 0)
                return { errorResult: null };
        }
        let error = roleId == common_1.constants.anonymousRoleId ? errors_1.errors.userNotLogin() : errors_1.errors.forbidden(u.pathname);
        error.name = errors_1.errorNames.noPermission;
        let result = new maishu_node_mvc_1.ContentResult("{}", "application/json; charset=utf-8", errors_1.errorStatusCodes.noPermission);
        console.warn(error);
        return { errorResult: result };
    });
}
exports.checkPath = checkPath;
function translateResources(resources, roleResources) {
    let myResources = resources.map(o => ({
        id: o.id, parentId: o.parent_id,
        roleIds: roleResources.filter(r => r.resource_id == o.id).map(r => r.role_id)
    }));
    for (let i = 0; i < myResources.length; i++) {
        if (myResources[i].parentId) {
            myResources[i].parent = myResources.filter(o => o.id == myResources[i].parentId)[0];
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
    });
    myResources.forEach(myResource => {
        // 去除重复元素
        myResource.roleIds = myResource.roleIds.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    });
    return myResources;
}
// function getAllChildResources(allResources: Resource[], allResourcePaths: ResourcePath[], allRoleResource: RoleResource[]): Resource[] {
//     // // let allResources = await dc.resources.find({ select: ["id", "parent_id"] });
//     // let item = allResources.filter(o => o.parent_id == resourceId)[0];
//     // console.assert(item != null);
//     let childResources: Resource[] = [];
//     let stack: Resource[] = allResources.filter(o => o.parent_id == null);
//     while (stack.length > 0) {
//         let item = stack.pop();
//         childResources.push(item);
//         let children = allResources.filter(o => o.parent_id == item.id);
//         stack.push(...children);
//     }
//     let items: { path_id: string, role_id: string, resource_id: string }[] = [];
//     for (let i = 0; i < childResources.length; i++) {
//         let pathIds = allResourcePaths.filter(o => o.resource_id == childResources[i].id).map(o => { o.path_id,});
//         // let roleIds = allRoleResource.filter(o => o.resource_id == childResources[i].id).map(o => o.role_id);
//         // for (let j = 0; j < pathIds.length; j++) {
//         //     for (let k = 0; k < roleIds.length; k++) {
//         //     }
//         // }
//     }
//     // childResources.map(o=>allResourcePaths.filter(p=>p.resource_id == o.id))
//     return childResources;
// }
//# sourceMappingURL=checkPath.js.map
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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const settings_1 = require("./settings");
const entities_1 = require("./entities");
const path = require("path");
const common_1 = require("./common");
const utility_1 = require("./utility");
const errors_1 = require("./errors");
class AuthDataContext {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository(entities_1.Role);
        this.categories = this.entityManager.getRepository(entities_1.Category);
        this.resources = this.entityManager.getRepository(entities_1.Resource);
        this.tokens = this.entityManager.getRepository(entities_1.Token);
        this.users = this.entityManager.getRepository(entities_1.User);
        this.userLatestLogins = this.entityManager.getRepository(entities_1.UserLatestLogin);
        this.smsRecords = this.entityManager.getRepository(entities_1.SMSRecord);
        this.paths = this.entityManager.getRepository(entities_1.Path);
        this.roleResources = this.entityManager.getRepository(entities_1.RoleResource);
        this.resourcePath = this.entityManager.getRepository(entities_1.ResourcePath);
    }
    createTopButtonResource(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.sort_number == null) {
                let r = yield this.resources.createQueryBuilder()
                    .select("max(sort_number) as max_sort_number").getRawOne();
                args.sort_number = (r["max_sort_number"] || 0) + 100;
            }
            if (args.showButtonText == null)
                args.showButtonText = true;
            let apiPaths = null;
            if (args.apiPaths) {
                apiPaths = yield Promise.all(args.apiPaths.map(o => getPath(this, o)));
            }
            let resource = {
                id: utility_1.guid(), name: args.name,
                type: "control", create_date_time: new Date(Date.now()),
                page_path: buttonControlsPath,
                sort_number: args.sort_number,
                data: {
                    position: "top-right",
                    button: {
                        className: args.className,
                        execute_path: `${buttonInvokePrefix}:${args.invokeMethodName}`,
                        showButtonText: args.showButtonText,
                    }
                },
                api_paths: apiPaths,
            };
            return this.resources.save(resource);
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.entityManager.connection.close();
        });
    }
}
exports.AuthDataContext = AuthDataContext;
// let connection: Connection;
function createDataContext(name) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (connection == null) {
        let connection = yield typeorm_1.createConnection({
            type: "mysql",
            host: settings_1.conn.auth.host,
            port: settings_1.conn.auth.port,
            username: settings_1.conn.auth.user,
            password: settings_1.conn.auth.password,
            database: settings_1.conn.auth.database,
            synchronize: true,
            logging: true,
            connectTimeout: 1000,
            entities: [
                path.join(__dirname, "entities.js")
            ],
            name: name
        });
        // }
        let dc = new AuthDataContext(connection.manager);
        return dc;
    });
}
exports.getDataContext = (function () {
    var dc = null;
    return function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (dc == null) {
                dc = yield createDataContext();
            }
            return dc;
        });
    };
})();
function initDatabase(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dc)
            throw errors_1.errors.argumentNull("dc");
        try {
            yield initRoleTable(dc);
            yield initResource(dc);
            yield initRoleResourceTable(dc);
            yield initUserTable(dc);
        }
        finally {
            dc.dispose();
        }
    });
}
exports.initDatabase = initDatabase;
let adminRoleId = common_1.constants.adminRoleId;
let anonymousRoleId = common_1.constants.anonymousRoleId;
let adminUserId = "240f103f-02a3-754c-f587-db122059fdfb";
let buttonControlsPath = "assert/controls/button.js";
let baseModuleResourceId = "AA3F1B10-311D-473E-A851-80D6FD8D91D3";
const buttonInvokePrefix = "func";
function initRoleTable(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield dc.roles.count();
        if (count > 0)
            return;
        let adminRole = {
            id: adminRoleId,
            name: "超级管理员",
            remark: "系统预设的超级管理员",
            create_date_time: new Date(Date.now()),
        };
        yield dc.roles.save(adminRole);
        let anonymousRole = {
            id: common_1.constants.anonymousRoleId,
            name: "匿名用户组",
            remark: "系统预设的匿名用户组",
            create_date_time: new Date(Date.now()),
        };
        yield dc.roles.save(anonymousRole);
    });
}
function initUserTable(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield dc.users.count();
        if (count > 0)
            return;
        let adminRole = yield dc.roles.findOne(adminRoleId);
        let admin = {
            id: adminUserId,
            mobile: "18502146746",
            password: "22",
            user_name: "admin",
            create_date_time: new Date(Date.now()),
            is_system: true,
            role_id: adminRole.id
        };
        yield dc.users.save(admin);
    });
}
function initResource(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield dc.resources.count();
        if (count > 0)
            return;
        let jsBasePath = "modules/auth";
        let pageBasePath = "auth";
        let userResourceId = "419379E4-9699-471E-9E45-CF7093656906";
        let permissionResourceId = "5d626d85-45fd-9128-1f54-a27ba55e573c";
        let roleResourceId = "212484f1-e500-7e5a-b409-cb9221a36a65";
        let menuResourceId = "8CA2AF51-BF5B-42A5-8E9E-2B9E48E4BFC0";
        let tokenResourceId = "3B758D8E-68CA-4196-89AF-9CF20DEB01DA";
        let rolePermissionResourceId = "688F60BA-102D-4EEC-AB77-9DFA029D0EA7";
        let pathResourceId = "9CE5F1AA-E78F-4D9C-93AF-1D2E59D2A9EF";
        let personalResourceId = "084DD384-A4A0-4CE6-94C8-C8C8997EA559";
        //===============================================================================================
        // 基本功能 开始
        let baseModuleResource = {
            id: baseModuleResourceId,
            name: "基本功能",
            sort_number: 40,
            create_date_time: new Date(Date.now()),
            type: "module",
            api_paths: yield Promise.all([common_1.actionPaths.resource.list].map(p => getPath(dc, p)))
        };
        yield dc.resources.save(baseModuleResource);
        let loginResource = {
            id: utility_1.guid(),
            name: "登录",
            sort_number: 100,
            create_date_time: new Date(Date.now()),
            type: "module",
            parent_id: baseModuleResourceId,
            api_paths: yield Promise.all([common_1.actionPaths.user.login].map(p => getPath(dc, p)))
        };
        yield dc.resources.save(loginResource);
        let registerResource = {
            id: utility_1.guid(),
            name: "注册",
            sort_number: 200,
            create_date_time: new Date(Date.now()),
            type: "module",
            parent_id: baseModuleResource.id,
            api_paths: yield Promise.all([common_1.actionPaths.user.register].map(p => getPath(dc, p)))
        };
        yield dc.resources.save(registerResource);
        let forgetResource = {
            id: utility_1.guid(),
            name: "找回密码",
            sort_number: 300,
            create_date_time: new Date(Date.now()),
            type: "module",
            parent_id: baseModuleResource.id,
            api_paths: yield Promise.all([common_1.actionPaths.user.resetPassword].map(p => getPath(dc, p)))
            //  [
            //     { id: guid(), value: actionPaths.user.resetPassword, create_date_time: new Date(Date.now()) }
            // ]
        };
        yield dc.resources.save(forgetResource);
        // 基本功能 结束
        //===============================================================================================
        let userResource = {
            id: userResourceId,
            name: "用户管理",
            sort_number: 80,
            type: "menu",
            create_date_time: new Date(Date.now()),
            page_path: `#${pageBasePath}/user/list`,
            icon: "icon-group",
            api_paths: yield Promise.all([common_1.actionPaths.user.list].map(p => getPath(dc, p)))
            // [
            //     { id: guid(), value: actionPaths.user.list, create_date_time: new Date(Date.now()) },
            // ]
        };
        yield dc.resources.save(userResource);
        yield createNormalAddButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [common_1.actionPaths.user.add]);
        yield createSmallEditButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [
            common_1.actionPaths.user.item,
            common_1.actionPaths.user.update
        ]);
        yield createRemoveButtonResource(dc, userResourceId, `${buttonInvokePrefix}:deleteItem`, [
            common_1.actionPaths.user.remove
        ]);
        let searchResource = {
            id: utility_1.guid(),
            name: "搜索",
            sort_number: 80,
            type: "control",
            create_date_time: new Date(Date.now()),
            page_path: `${jsBasePath}/user/search-control.js`,
            data: { position: "top-right", code: "search" },
            parent_id: userResource.id,
            api_paths: yield Promise.all([common_1.actionPaths.user.list].map(p => getPath(dc, p)))
            //  [
            //     { id: guid(), value: actionPaths.user.list, create_date_time: new Date(Date.now()) },
            // ]
        };
        yield dc.resources.save(searchResource);
        //===============================================================================================
        let permissionResource = {
            id: permissionResourceId,
            name: "权限管理",
            sort_number: 100,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-lock",
        };
        yield dc.resources.save(permissionResource);
        //===============================================================================================
        // 角色管理 开始
        let roleResource = {
            id: roleResourceId,
            name: "角色管理",
            sort_number: 200,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: `#${pageBasePath}/role/list`,
            icon: "icon-sitemap",
            api_paths: yield Promise.all([common_1.actionPaths.role.list].map(p => getPath(dc, p)))
            //  [
            //     { id: guid(), value: actionPaths.role.list, create_date_time: new Date(Date.now()) }
            // ]
        };
        yield dc.resources.save(roleResource);
        yield createNormalAddButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [common_1.actionPaths.role.add]);
        yield createSmallEditButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            common_1.actionPaths.role.item,
            common_1.actionPaths.role.update,
        ]);
        yield createRemoveButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            common_1.actionPaths.role.remove,
        ]);
        yield createSmallViewButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            common_1.actionPaths.role.item,
        ]);
        let rolePermissionResource = {
            id: rolePermissionResourceId,
            name: "权限设置",
            sort_number: 40,
            type: "control",
            create_date_time: new Date(Date.now()),
            parent_id: roleResourceId,
            page_path: buttonControlsPath,
            data: {
                position: "in-list",
                code: "role_permission",
                button: {
                    className: "btn btn-minier btn-default",
                    execute_path: "#auth/permission/list",
                    title: "点击设置权限",
                    showButtonText: true,
                }
            }
        };
        yield dc.resources.save(rolePermissionResource);
        yield createNormalSaveButtonResource(dc, rolePermissionResource.id, `${buttonInvokePrefix}:save`, [
            common_1.actionPaths.role.resource.set,
            common_1.actionPaths.role.resource.ids
        ]);
        // 角色管理 结束
        //===============================================================================================
        let menuResource = {
            id: menuResourceId,
            name: "菜单管理",
            sort_number: 300,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: `#${pageBasePath}/menu/list`,
            icon: "icon-tasks",
            api_paths: yield Promise.all([common_1.actionPaths.menu.list].map(p => getPath(dc, p)))
            // [
            //     { id: guid(), value: actionPaths.menu.list, create_date_time: new Date(Date.now()) }
            // ]
        };
        yield dc.resources.save(menuResource);
        yield createNormalAddButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [common_1.actionPaths.menu.add, common_1.actionPaths.resource.add,]);
        let menuAddButtonResource = {
            id: utility_1.guid(),
            name: "添加控件",
            sort_number: 200,
            type: "control",
            create_date_time: new Date(Date.now()),
            parent_id: menuResource.id,
            page_path: `${jsBasePath}/menu/controls.js`,
            api_paths: yield Promise.all([common_1.actionPaths.menu.add].map(p => getPath(dc, p))),
            //  [
            //     { id: guid(), value: actionPaths.menu.add, create_date_time: new Date(Date.now()) }
            // ],
            data: { position: "top-right", code: "add_control" }
        };
        yield dc.resources.save(menuAddButtonResource);
        yield createSmallEditButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            common_1.actionPaths.menu.item,
            common_1.actionPaths.menu.update,
            common_1.actionPaths.resource.item,
            common_1.actionPaths.resource.update,
        ]);
        yield createRemoveButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            common_1.actionPaths.menu.remove,
            common_1.actionPaths.resource.remove,
        ]);
        yield createSmallViewButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            common_1.actionPaths.menu.item,
            common_1.actionPaths.resource.item,
        ]);
        let tokenResource = {
            id: tokenResourceId,
            name: "令牌管理",
            sort_number: 400,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: `#${pageBasePath}/token/list`,
            icon: "icon-magic",
            api_paths: yield Promise.all([common_1.actionPaths.token.list].map(p => getPath(dc, p)))
            //  [
            //     { id: guid(), value: actionPaths.token.list, create_date_time: new Date(Date.now()) }
            // ]
        };
        yield dc.resources.save(tokenResource);
        yield createNormalAddButtonResource(dc, tokenResourceId, `${jsBasePath}/token/controls.js`, [common_1.actionPaths.token.add]);
        let pathResource = {
            id: pathResourceId,
            name: "API 设置",
            sort_number: 500,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: `#${pageBasePath}/path/list`,
            icon: "icon-rss",
            api_paths: yield Promise.all([
                common_1.actionPaths.path.list, common_1.actionPaths.path.listByResourceIds,
                common_1.actionPaths.resource.path.set, common_1.actionPaths.resource_path.list,
            ].map(p => getPath(dc, p)))
            // [
            //     { id: guid(), value: actionPaths.path.list, create_date_time: new Date(Date.now()) },
            //     { id: guid(), value: actionPaths.resource.path.set, create_date_time: new Date(Date.now()) }
            // ]
        };
        yield dc.resources.save(pathResource);
        yield createSmallEditButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
        yield createSmallViewButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
        let personalResource = {
            id: personalResourceId,
            name: "个人中心",
            sort_number: 600,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-user",
            api_paths: yield Promise.all([common_1.actionPaths.user.me].map(p => getPath(dc, p)))
        };
        yield dc.resources.save(personalResource);
        let changeMobileResource = {
            id: utility_1.guid(),
            name: "修改手机号",
            sort_number: 800,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-tablet",
            parent_id: personalResource.id,
            page_path: `#${pageBasePath}/personal/change-mobile`,
            api_paths: yield Promise.all([common_1.actionPaths.sms.sendVerifyCode].map(p => getPath(dc, p)))
        };
        yield dc.resources.save(changeMobileResource);
        yield createNormalSaveButtonResource(dc, changeMobileResource.id, `${buttonInvokePrefix}:save`, [
            common_1.actionPaths.user.resetMobile
        ]);
        let changePasswordResource = {
            id: utility_1.guid(),
            name: "修改密码",
            sort_number: 700,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-key",
            parent_id: personalResource.id,
            page_path: `#${pageBasePath}/personal/change-password`,
            api_paths: yield Promise.all([common_1.actionPaths.sms.sendVerifyCode].map(p => getPath(dc, p)))
        };
        yield dc.resources.save(changePasswordResource);
        yield createNormalSaveButtonResource(dc, changePasswordResource.id, `${buttonInvokePrefix}:save`, [
            common_1.actionPaths.user.resetPassword,
        ]);
    });
}
function initRoleResourceTable(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        // let adminRole = await dc.roles.findOne(adminRoleId);
        // let allResources = await dc.resources.find();
        // adminRole.resources = allResources;
        // await dc.roles.save(adminRole);
        dc.roleResources.delete({});
        let roleResource = { role_id: anonymousRoleId, resource_id: baseModuleResourceId };
        yield dc.roleResources.save(roleResource);
    });
}
function createNormalAddButtonResource(dc, parentId, path, apiPaths) {
    return __awaiter(this, void 0, void 0, function* () {
        let execute_path;
        if (path.startsWith("func")) {
            execute_path = path;
            path = buttonControlsPath;
        }
        let menuResource = {
            id: utility_1.guid(),
            name: "添加",
            sort_number: 100,
            type: "control",
            parent_id: parentId,
            page_path: path,
            create_date_time: new Date(Date.now()),
            data: {
                position: "top-right",
                code: "add",
                button: {
                    className: "btn btn-primary",
                    showButtonText: true,
                    title: "点击添加",
                    execute_path
                }
            },
            api_paths: yield Promise.all(apiPaths.map(p => getPath(dc, p))),
            icon: "icon-plus"
        };
        return dc.resources.save(menuResource);
    });
}
function createNormalSaveButtonResource(dc, parentId, path, apiPaths) {
    return __awaiter(this, void 0, void 0, function* () {
        let execute_path;
        if (path.startsWith("func")) {
            execute_path = path;
            path = buttonControlsPath;
        }
        let menuResource = {
            id: utility_1.guid(),
            name: "保存",
            sort_number: 100,
            type: "control",
            parent_id: parentId,
            page_path: path,
            create_date_time: new Date(Date.now()),
            data: {
                position: "top-right",
                code: "save",
                button: {
                    execute_path: execute_path,
                    className: "btn btn-primary",
                    showButtonText: true,
                    toast: "保存成功!",
                }
            },
            api_paths: yield Promise.all(apiPaths.map(p => getPath(dc, p))),
            icon: "icon-save",
        };
        return dc.resources.save(menuResource);
    });
}
function createSmallEditButtonResource(dc, parentId, path, apiPaths) {
    return __awaiter(this, void 0, void 0, function* () {
        let execute_path;
        if (path.startsWith("func")) {
            execute_path = path;
            path = buttonControlsPath;
        }
        let menuResource = {
            id: utility_1.guid(),
            name: "编辑",
            sort_number: 200,
            type: "control",
            parent_id: parentId,
            page_path: path,
            create_date_time: new Date(Date.now()),
            data: {
                position: "in-list",
                code: "edit",
                button: {
                    className: "btn btn-minier btn-info",
                    showButtonText: false,
                    title: "点击编辑",
                    execute_path
                }
            },
            api_paths: yield Promise.all(apiPaths.map(p => getPath(dc, p))),
            icon: "icon-pencil"
        };
        return dc.resources.save(menuResource);
    });
}
function createRemoveButtonResource(dc, parentId, path, apiPaths) {
    return __awaiter(this, void 0, void 0, function* () {
        let execute_path;
        if (path.startsWith("func")) {
            execute_path = path;
            path = buttonControlsPath;
        }
        let menuResource = {
            id: utility_1.guid(),
            name: "删除",
            sort_number: 300,
            type: "control",
            parent_id: parentId,
            page_path: path,
            create_date_time: new Date(Date.now()),
            data: {
                position: "in-list",
                code: "remove",
                button: {
                    className: "btn btn-minier btn-danger",
                    showButtonText: false,
                    title: "点击删除",
                    execute_path,
                }
            },
            api_paths: yield Promise.all(apiPaths.map(p => getPath(dc, p))),
            icon: "icon-trash"
        };
        return dc.resources.save(menuResource);
    });
}
function createSmallViewButtonResource(dc, parentId, path, apiPaths) {
    return __awaiter(this, void 0, void 0, function* () {
        let menuResource = {
            id: utility_1.guid(),
            name: "查看",
            sort_number: 400,
            type: "control",
            parent_id: parentId,
            page_path: path,
            create_date_time: new Date(Date.now()),
            data: {
                position: "in-list",
                code: "view",
                button: {
                    className: "btn btn-minier btn-success",
                    showButtonText: false,
                }
            },
            api_paths: yield Promise.all(apiPaths.map(p => getPath(dc, p))),
            icon: "icon-eye-open"
        };
        return dc.resources.save(menuResource);
    });
}
function getPath(dc, value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dc)
            throw errors_1.errors.argumentNull("dc");
        let path = yield dc.paths.findOne({ value: value });
        if (path == null) {
            path = { id: utility_1.guid(), value, create_date_time: new Date(Date.now()) };
        }
        return path;
    });
}
//# sourceMappingURL=dataContext.js.map
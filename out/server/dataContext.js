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
const maishu_node_mvc_1 = require("maishu-node-mvc");
const settings_1 = require("./settings");
const entities_1 = require("./entities");
const path = require("path");
const database_1 = require("./database");
const common_1 = require("./common");
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
        this.userRoles = this.entityManager.getRepository(entities_1.UserRole);
        this.paths = this.entityManager.getRepository(entities_1.Path);
        this.roleResources = this.entityManager.getRepository(entities_1.RoleResource);
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.entityManager.connection.close();
        });
    }
}
exports.AuthDataContext = AuthDataContext;
exports.authDataContext = maishu_node_mvc_1.createParameterDecorator(() => __awaiter(this, void 0, void 0, function* () {
    let dc = yield createDataContext();
    return dc;
}), (dc) => __awaiter(this, void 0, void 0, function* () {
    yield dc.dispose();
}));
let connection;
function createDataContext(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection == null) {
            connection = yield typeorm_1.createConnection({
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
        }
        let dc = new AuthDataContext(connection.manager);
        return dc;
    });
}
exports.createDataContext = createDataContext;
function initDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let dc = yield createDataContext();
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
let buttonControlsPath = "controls/button";
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
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.resource.list, create_date_time: new Date(Date.now()) },
            ]
        };
        yield dc.resources.save(baseModuleResource);
        let loginResource = {
            id: database_1.guid(),
            name: "登录",
            sort_number: 100,
            create_date_time: new Date(Date.now()),
            type: "module",
            parent_id: baseModuleResource.id,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.login, create_date_time: new Date(Date.now()) },
            ]
        };
        yield dc.resources.save(loginResource);
        let registerResource = {
            id: database_1.guid(),
            name: "注册",
            sort_number: 200,
            create_date_time: new Date(Date.now()),
            type: "module",
            parent_id: baseModuleResource.id,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.register, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(registerResource);
        let forgetResource = {
            id: database_1.guid(),
            name: "找回密码",
            sort_number: 300,
            create_date_time: new Date(Date.now()),
            type: "module",
            parent_id: baseModuleResource.id,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.resetPassword, create_date_time: new Date(Date.now()) }
            ]
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
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.list, create_date_time: new Date(Date.now()) },
            ]
        };
        yield dc.resources.save(userResource);
        yield createNormalAddButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [
            { id: database_1.guid(), value: common_1.actionPaths.user.add, create_date_time: new Date(Date.now()) }
        ]);
        yield createSmallEditButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [
            { id: database_1.guid(), value: common_1.actionPaths.user.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.user.update, create_date_time: new Date(Date.now()) }
        ]);
        yield createRemoveButtonResource(dc, userResourceId, `${buttonInvokePrefix}:deleteItem`, [
            { id: database_1.guid(), value: common_1.actionPaths.user.remove, create_date_time: new Date(Date.now()) }
        ]);
        let searchResource = {
            id: database_1.guid(),
            name: "搜索",
            sort_number: 80,
            type: "control",
            create_date_time: new Date(Date.now()),
            page_path: `${jsBasePath}/user/controls.js`,
            data: { position: "top", code: "search" },
            parent_id: userResource.id,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.list, create_date_time: new Date(Date.now()) },
            ]
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
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.role.list, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(roleResource);
        yield createNormalAddButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.role.add, create_date_time: new Date(Date.now()) },
        ]);
        yield createSmallEditButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.role.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.role.update, create_date_time: new Date(Date.now()) },
        ]);
        yield createRemoveButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.role.remove, create_date_time: new Date(Date.now()) },
        ]);
        yield createViewButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.role.item, create_date_time: new Date(Date.now()) },
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
        yield createNormalSaveButtonResource(dc, rolePermissionResource.id, `${jsBasePath}/permission/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.role.resource.set, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.role.resource.ids, create_date_time: new Date(Date.now()) }
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
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.menu.list, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(menuResource);
        yield createNormalAddButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.menu.add, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.resource.add, create_date_time: new Date(Date.now()) },
        ]);
        let menuAddButtonResource = {
            id: database_1.guid(),
            name: "添加控件",
            sort_number: 200,
            type: "control",
            create_date_time: new Date(Date.now()),
            parent_id: menuResource.id,
            page_path: `${jsBasePath}/menu/controls.js`,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.menu.add, create_date_time: new Date(Date.now()) }
            ],
            data: { position: "top", code: "add_control" }
        };
        yield dc.resources.save(menuAddButtonResource);
        yield createSmallEditButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.menu.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.menu.update, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.resource.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.resource.update, create_date_time: new Date(Date.now()) },
        ]);
        yield createRemoveButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.menu.remove, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.resource.remove, create_date_time: new Date(Date.now()) },
        ]);
        yield createViewButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.menu.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.resource.item, create_date_time: new Date(Date.now()) },
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
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.token.list, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(tokenResource);
        yield createNormalAddButtonResource(dc, tokenResourceId, `${jsBasePath}/token/controls.js`, [
            { id: database_1.guid(), value: common_1.actionPaths.token.add, create_date_time: new Date(Date.now()) },
        ]);
        let pathResource = {
            id: pathResourceId,
            name: "API 设置",
            sort_number: 500,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: `#${pageBasePath}/path/list`,
            icon: "icon-rss",
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.path.list, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(pathResource);
        yield createNormalAddButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
        yield createSmallEditButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
        yield createViewButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
        let personalResource = {
            id: personalResourceId,
            name: "个人中心",
            sort_number: 600,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-user",
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.me, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(personalResource);
        let changeMobileResource = {
            id: database_1.guid(),
            name: "修改手机号",
            sort_number: 800,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-tablet",
            parent_id: personalResource.id,
            page_path: `#${pageBasePath}/personal/change-mobile`,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.resetMobile, create_date_time: new Date(Date.now()) },
                { id: database_1.guid(), value: common_1.actionPaths.sms.sendVerifyCode, create_date_time: new Date(Date.now()) },
            ]
        };
        yield dc.resources.save(changeMobileResource);
        yield createNormalSaveButtonResource(dc, changeMobileResource.id, `${buttonControlsPath}:save`, []);
        let changePasswordResource = {
            id: database_1.guid(),
            name: "修改密码",
            sort_number: 700,
            type: "menu",
            create_date_time: new Date(Date.now()),
            icon: "icon-key",
            parent_id: personalResource.id,
            page_path: `#${pageBasePath}/personal/change-password`,
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.resetPassword, create_date_time: new Date(Date.now()) },
                { id: database_1.guid(), value: common_1.actionPaths.sms.sendVerifyCode, create_date_time: new Date(Date.now()) },
            ]
        };
        yield dc.resources.save(changePasswordResource);
        yield createNormalSaveButtonResource(dc, changePasswordResource.id, `${buttonInvokePrefix}:save`, []);
    });
}
function initRoleResourceTable(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminRole = yield dc.roles.findOne(adminRoleId);
        let allResources = yield dc.resources.find();
        adminRole.resources = allResources;
        yield dc.roles.save(adminRole);
        let roleResource = { role_id: anonymousRoleId, resource_id: baseModuleResourceId };
        yield dc.roleResources.save(roleResource);
    });
}
function createNormalAddButtonResource(dc, parentId, path, apiPaths) {
    let execute_path;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }
    let menuResource = {
        id: database_1.guid(),
        name: "添加",
        sort_number: 100,
        type: "control",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data: {
            position: "top",
            code: "add",
            button: {
                className: "btn btn-primary",
                showButtonText: true,
                title: "点击添加",
                execute_path
            }
        },
        api_paths: apiPaths,
        icon: "icon-plus"
    };
    return dc.resources.save(menuResource);
}
function createNormalSaveButtonResource(dc, parentId, path, apiPaths) {
    let data = {
        position: "top",
        code: "save",
        button: {
            execute_path: path,
            className: "btn btn-primary",
            showButtonText: true,
            toast: "保存成功!",
        }
    };
    let menuResource = {
        id: database_1.guid(),
        name: "保存",
        sort_number: 100,
        type: "control",
        parent_id: parentId,
        page_path: buttonControlsPath,
        create_date_time: new Date(Date.now()),
        data: data,
        api_paths: apiPaths,
        icon: "icon-save",
    };
    return dc.resources.save(menuResource);
}
function createSmallEditButtonResource(dc, parentId, path, apiPaths) {
    let execute_path;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }
    let menuResource = {
        id: database_1.guid(),
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
        api_paths: apiPaths,
        icon: "icon-pencil"
    };
    return dc.resources.save(menuResource);
}
function createRemoveButtonResource(dc, parentId, path, apiPaths) {
    let execute_path;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }
    let menuResource = {
        id: database_1.guid(),
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
        api_paths: apiPaths,
        icon: "icon-trash"
    };
    return dc.resources.save(menuResource);
}
function createViewButtonResource(dc, parentId, path, apiPaths) {
    let menuResource = {
        id: database_1.guid(),
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
        api_paths: apiPaths,
        icon: "icon-eye-open"
    };
    return dc.resources.save(menuResource);
}
//# sourceMappingURL=dataContext.js.map
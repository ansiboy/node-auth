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
const buttonCodes = {
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    view: 'view'
};
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
let adminUserId = "240f103f-02a3-754c-f587-db122059fdfb";
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
            is_system: true
        };
        yield dc.roles.save(adminRole);
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
            // roles: [adminRole]
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
        let userResourceId = "419379E4-9699-471E-9E45-CF7093656906";
        let permissionResourceId = "5d626d85-45fd-9128-1f54-a27ba55e573c";
        let roleResourceId = "212484f1-e500-7e5a-b409-cb9221a36a65";
        let menuResourceId = "8CA2AF51-BF5B-42A5-8E9E-2B9E48E4BFC0";
        let tokenResourceId = "3B758D8E-68CA-4196-89AF-9CF20DEB01DA";
        let rolePermissionResourceId = "688F60BA-102D-4EEC-AB77-9DFA029D0EA7";
        let pathResourceId = "9CE5F1AA-E78F-4D9C-93AF-1D2E59D2A9EF";
        let userResource = {
            id: userResourceId,
            name: "用户管理",
            sort_number: 80,
            type: "menu",
            create_date_time: new Date(Date.now()),
            page_path: "#user/list",
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.user.list, create_date_time: new Date(Date.now()) },
            ]
        };
        let permissionResource = {
            id: permissionResourceId,
            name: "权限管理",
            sort_number: 100,
            type: "menu",
            create_date_time: new Date(Date.now()),
        };
        let roleResource = {
            id: roleResourceId,
            name: "角色管理",
            sort_number: 200,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: "#role/list",
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.role.list, create_date_time: new Date(Date.now()) }
            ]
        };
        let menuResource = {
            id: menuResourceId,
            name: "菜单管理",
            sort_number: 300,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: "#menu/list",
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.menu.list, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(userResource);
        yield createAddButtonResource(dc, userResourceId, "modules/user/item.js", [
            { id: database_1.guid(), value: common_1.actionPaths.user.add, create_date_time: new Date(Date.now()) }
        ]);
        yield dc.resources.save(permissionResource);
        yield dc.resources.save(roleResource);
        yield createAddButtonResource(dc, roleResourceId, "modules/role/item.js", [
            { id: database_1.guid(), value: common_1.actionPaths.role.add, create_date_time: new Date(Date.now()) },
        ]);
        yield createEditButtonResource(dc, roleResourceId, "modules/role/item.js", [
            { id: database_1.guid(), value: common_1.actionPaths.role.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.role.update, create_date_time: new Date(Date.now()) },
        ]);
        yield createRemoveButtonResource(dc, roleResourceId, "modules/role/remove.js", [
            { id: database_1.guid(), value: common_1.actionPaths.role.remove, create_date_time: new Date(Date.now()) },
        ]);
        yield createViewButtonResource(dc, roleResourceId, "modules/role/item.js", [
            { id: database_1.guid(), value: common_1.actionPaths.role.item, create_date_time: new Date(Date.now()) },
        ]);
        yield dc.resources.save(menuResource);
        yield createAddButtonResource(dc, menuResource.id, "#menu/item", [
            { id: database_1.guid(), value: common_1.actionPaths.menu.add, create_date_time: new Date(Date.now()) }
        ]);
        yield createEditButtonResource(dc, menuResource.id, "#menu/item", [
            { id: database_1.guid(), value: common_1.actionPaths.menu.item, create_date_time: new Date(Date.now()) },
            { id: database_1.guid(), value: common_1.actionPaths.menu.update, create_date_time: new Date(Date.now()) }
        ]);
        yield createRemoveButtonResource(dc, menuResource.id, "#menu/item", [
            { id: database_1.guid(), value: common_1.actionPaths.menu.remove, create_date_time: new Date(Date.now()) },
        ]);
        yield createViewButtonResource(dc, menuResource.id, "#menu/item", [
            { id: database_1.guid(), value: common_1.actionPaths.menu.item, create_date_time: new Date(Date.now()) },
        ]);
        let tokenResource = {
            id: tokenResourceId,
            name: "令牌管理",
            sort_number: 400,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: "#token/list",
            api_paths: [
                { id: database_1.guid(), value: common_1.actionPaths.token.list, create_date_time: new Date(Date.now()) }
            ]
        };
        yield dc.resources.save(tokenResource);
        yield createAddButtonResource(dc, tokenResourceId, "token/item", [
            { id: database_1.guid(), value: common_1.actionPaths.token.add, create_date_time: new Date(Date.now()) },
        ]);
        let rolePermissionResource = {
            id: rolePermissionResourceId,
            name: "权限设置",
            sort_number: 40,
            type: "button",
            create_date_time: new Date(Date.now()),
            parent_id: roleResourceId,
            page_path: "#role/permission"
        };
        yield dc.resources.save(rolePermissionResource);
        let pathResource = {
            id: pathResourceId,
            name: "路径管理",
            sort_number: 500,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            page_path: "#path/list"
        };
        yield dc.resources.save(pathResource);
        createAddButtonResource(dc, pathResource.id, "modules/path/item.js", []);
        createEditButtonResource(dc, pathResource.id, "modules/path/item.js", []);
        createRemoveButtonResource(dc, pathResource.id, "modules/path/remove.js");
        createViewButtonResource(dc, pathResource.id, "modules/path/view.js");
    });
}
function initRoleResourceTable(dc) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminRole = yield dc.roles.findOne(adminRoleId);
        let allResources = yield dc.resources.find();
        adminRole.resources = allResources;
        yield dc.roles.save(adminRole);
    });
}
function createAddButtonResource(dc, parentId, path, apiPaths) {
    let menuResource = {
        id: database_1.guid(),
        name: "添加",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data: { code: buttonCodes.add },
        api_paths: apiPaths
    };
    return dc.resources.save(menuResource);
}
function createEditButtonResource(dc, parentId, path, apiPaths) {
    let data = {
        code: buttonCodes.edit,
    };
    let menuResource = {
        id: database_1.guid(),
        name: "修改",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data,
        api_paths: apiPaths
    };
    return dc.resources.save(menuResource);
}
function createRemoveButtonResource(dc, parentId, path, apiPaths) {
    let data = {
        code: buttonCodes.delete,
    };
    let menuResource = {
        id: database_1.guid(),
        name: "删除",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data,
        api_paths: apiPaths
    };
    return dc.resources.save(menuResource);
}
function createViewButtonResource(dc, parentId, path, apiPaths) {
    let data = {
        code: buttonCodes.view,
    };
    let menuResource = {
        id: database_1.guid(),
        name: "查看",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data,
        api_paths: apiPaths
    };
    return dc.resources.save(menuResource);
}
//# sourceMappingURL=dataContext.js.map
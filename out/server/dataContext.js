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
let adminRoleId = "535e89a2-5b17-4e65-fecb-0259015b1a9b";
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
            create_date_time: new Date(Date.now())
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
            create_date_time: new Date(Date.now()),
            roles: [adminRole]
        };
        return dc.users.save(admin);
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
        let userResource = {
            id: userResourceId,
            name: "用户管理",
            sort_number: 80,
            type: "menu",
            create_date_time: new Date(Date.now()),
            path: "user/list",
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
            path: "role/list",
        };
        let menuResource = {
            id: menuResourceId,
            name: "菜单管理",
            sort_number: 300,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            path: "menu/list"
        };
        yield dc.resources.save(userResource);
        yield createAddButtonResource(dc, userResourceId, "user/item");
        yield dc.resources.save(permissionResource);
        yield dc.resources.save(roleResource);
        yield createAddButtonResource(dc, roleResourceId, "role/item");
        yield createModifyButtonResource(dc, roleResourceId, "role/item");
        yield createRemoveButtonResource(dc, roleResourceId, "javascript:remove");
        yield createViewButtonResource(dc, roleResourceId, "role/item");
        yield dc.resources.save(menuResource);
        yield createAddButtonResource(dc, menuResource.id, "menu/item");
        yield createModifyButtonResource(dc, menuResource.id, "menu/item");
        yield createRemoveButtonResource(dc, menuResource.id, "javascript:remove");
        yield createViewButtonResource(dc, menuResource.id, "menu/item");
        let tokenResource = {
            id: tokenResourceId,
            name: "令牌管理",
            sort_number: 400,
            type: "menu",
            create_date_time: new Date(Date.now()),
            parent_id: permissionResourceId,
            path: "token/list"
        };
        yield dc.resources.save(tokenResource);
        yield createAddButtonResource(dc, tokenResourceId, "token/item");
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
function createAddButtonResource(dc, parentId, path) {
    let menuResource = {
        id: database_1.guid(),
        name: "添加",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    };
    return dc.resources.save(menuResource);
}
function createModifyButtonResource(dc, parentId, path) {
    let menuResource = {
        id: database_1.guid(),
        name: "修改",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    };
    return dc.resources.save(menuResource);
}
function createRemoveButtonResource(dc, parentId, path) {
    let menuResource = {
        id: database_1.guid(),
        name: "删除",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    };
    return dc.resources.save(menuResource);
}
function createViewButtonResource(dc, parentId, path) {
    let menuResource = {
        id: database_1.guid(),
        name: "查看",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    };
    return dc.resources.save(menuResource);
}
//# sourceMappingURL=dataContext.js.map
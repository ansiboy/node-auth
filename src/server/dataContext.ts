import "reflect-metadata";
import { createConnection, EntityManager, Repository, Connection } from "typeorm";
import { createParameterDecorator } from "maishu-node-mvc";
import { conn } from './settings';
import { Role, Category, Resource, Token, User, UserLatestLogin, SMSRecord, UserRole, Path } from "./entities";
import path = require("path");
import { guid } from "./database";
import { constants, actionPaths } from "./common";

const buttonCodes = {
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    view: 'view'
}

type ButtonResourceData = {
    code: string,
}

export class AuthDataContext {
    private entityManager: EntityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    tokens: Repository<Token>;
    users: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    userRoles: Repository<UserRole>;
    paths: Repository<Path>;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository(Role);
        this.categories = this.entityManager.getRepository(Category);
        this.resources = this.entityManager.getRepository(Resource);
        this.tokens = this.entityManager.getRepository(Token);
        this.users = this.entityManager.getRepository(User);
        this.userLatestLogins = this.entityManager.getRepository(UserLatestLogin);
        this.smsRecords = this.entityManager.getRepository(SMSRecord);
        this.userRoles = this.entityManager.getRepository(UserRole);
        this.paths = this.entityManager.getRepository(Path);
    }

    async dispose() {
        // await this.entityManager.connection.close();
    }
}

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        let dc = await createDataContext()
        return dc
    },
    async (dc) => {
        await dc.dispose()
    }
)

let connection: Connection;
export async function createDataContext(name?: string): Promise<AuthDataContext> {
    if (connection == null) {
        connection = await createConnection({
            type: "mysql",
            host: conn.auth.host,
            port: conn.auth.port,
            username: conn.auth.user,
            password: conn.auth.password,
            database: conn.auth.database,
            synchronize: true,
            logging: true,
            connectTimeout: 1000,
            entities: [
                path.join(__dirname, "entities.js")
            ],
            name: name
        })
    }

    let dc = new AuthDataContext(connection.manager)
    return dc
}

export async function initDatabase() {
    let dc = await createDataContext();

    try {
        await initRoleTable(dc);
        await initResource(dc);
        await initRoleResourceTable(dc);
        await initUserTable(dc);
    }
    finally {
        dc.dispose();
    }
}

let adminRoleId = constants.adminRoleId;
let adminUserId = "240f103f-02a3-754c-f587-db122059fdfb";

async function initRoleTable(dc: AuthDataContext) {
    let count = await dc.roles.count();
    if (count > 0)
        return;

    let adminRole: Role = {
        id: adminRoleId,
        name: "超级管理员",
        remark: "系统预设的超级管理员",
        create_date_time: new Date(Date.now()),
        is_system: true
    }

    await dc.roles.save(adminRole);
}

async function initUserTable(dc: AuthDataContext) {
    let count = await dc.users.count();
    if (count > 0)
        return;

    let adminRole = await dc.roles.findOne(adminRoleId);

    let admin: User = {
        id: adminUserId,
        mobile: "18502146746",
        password: "22",
        user_name: "admin",
        create_date_time: new Date(Date.now()),
        is_system: true,
        // roles: [adminRole]
        role_id: adminRole.id
    }

    await dc.users.save(admin);

}

async function initResource(dc: AuthDataContext) {

    let count = await dc.resources.count();
    if (count > 0)
        return;

    let userResourceId = "419379E4-9699-471E-9E45-CF7093656906";
    let permissionResourceId = "5d626d85-45fd-9128-1f54-a27ba55e573c";
    let roleResourceId = "212484f1-e500-7e5a-b409-cb9221a36a65";
    let menuResourceId = "8CA2AF51-BF5B-42A5-8E9E-2B9E48E4BFC0";
    let tokenResourceId = "3B758D8E-68CA-4196-89AF-9CF20DEB01DA";
    let rolePermissionResourceId = "688F60BA-102D-4EEC-AB77-9DFA029D0EA7";
    let pathResourceId = "9CE5F1AA-E78F-4D9C-93AF-1D2E59D2A9EF";

    let userResource: Resource = {
        id: userResourceId,
        name: "用户管理",
        sort_number: 80,
        type: "menu",
        create_date_time: new Date(Date.now()),
        page_path: "#user/list",
        api_paths: [
            { id: guid(), value: actionPaths.user.list, create_date_time: new Date(Date.now()) },
        ]
    }
    let permissionResource: Resource = {
        id: permissionResourceId,
        name: "权限管理",
        sort_number: 100,
        type: "menu",
        create_date_time: new Date(Date.now()),
    }

    let roleResource: Resource = {
        id: roleResourceId,
        name: "角色管理",
        sort_number: 200,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: "#role/list",
        api_paths: [
            { id: guid(), value: actionPaths.role.list, create_date_time: new Date(Date.now()) }
        ]
    }

    let menuResource: Resource = {
        id: menuResourceId,
        name: "菜单管理",
        sort_number: 300,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: "#menu/list",
        api_paths: [
            { id: guid(), value: actionPaths.menu.list, create_date_time: new Date(Date.now()) }
        ]
    }

    await dc.resources.save(userResource);
    await createAddButtonResource(dc, userResourceId, "modules/user/item.js", [
        { id: guid(), value: actionPaths.user.add, create_date_time: new Date(Date.now()) }
    ]);

    await dc.resources.save(permissionResource);

    await dc.resources.save(roleResource);
    await createAddButtonResource(dc, roleResourceId, "modules/role/item.js", [
        { id: guid(), value: actionPaths.role.add, create_date_time: new Date(Date.now()) },
    ]);
    await createEditButtonResource(dc, roleResourceId, "modules/role/item.js", [
        { id: guid(), value: actionPaths.role.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.role.update, create_date_time: new Date(Date.now()) },
    ]);
    await createRemoveButtonResource(dc, roleResourceId, "modules/role/remove.js", [
        { id: guid(), value: actionPaths.role.remove, create_date_time: new Date(Date.now()) },
    ]);
    await createViewButtonResource(dc, roleResourceId, "modules/role/item.js", [
        { id: guid(), value: actionPaths.role.item, create_date_time: new Date(Date.now()) },
    ]);

    await dc.resources.save(menuResource);
    await createAddButtonResource(dc, menuResource.id, "#menu/item", [
        { id: guid(), value: actionPaths.menu.add, create_date_time: new Date(Date.now()) }
    ]);
    await createEditButtonResource(dc, menuResource.id, "#menu/item", [
        { id: guid(), value: actionPaths.menu.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.menu.update, create_date_time: new Date(Date.now()) }
    ]);
    await createRemoveButtonResource(dc, menuResource.id, "#menu/item", [
        { id: guid(), value: actionPaths.menu.remove, create_date_time: new Date(Date.now()) },
    ]);
    await createViewButtonResource(dc, menuResource.id, "#menu/item", [
        { id: guid(), value: actionPaths.menu.item, create_date_time: new Date(Date.now()) },
    ]);

    let tokenResource: Resource = {
        id: tokenResourceId,
        name: "令牌管理",
        sort_number: 400,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: "#token/list",
        api_paths: [
            { id: guid(), value: actionPaths.token.list, create_date_time: new Date(Date.now()) }
        ]
    }
    await dc.resources.save(tokenResource);
    await createAddButtonResource(dc, tokenResourceId, "token/item", [
        { id: guid(), value: actionPaths.token.add, create_date_time: new Date(Date.now()) },
    ]);

    let rolePermissionResource: Resource = {
        id: rolePermissionResourceId,
        name: "权限设置",
        sort_number: 40,
        type: "button",
        create_date_time: new Date(Date.now()),
        parent_id: roleResourceId,
        page_path: "#role/permission"
    }
    await dc.resources.save(rolePermissionResource);

    let pathResource: Resource = {
        id: pathResourceId,
        name: "路径管理",
        sort_number: 500,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: "#path/list"
    }

    await dc.resources.save(pathResource);
    createAddButtonResource(dc, pathResource.id, "modules/path/item.js", []);
    createEditButtonResource(dc, pathResource.id, "modules/path/item.js", []);
    createRemoveButtonResource(dc, pathResource.id, "modules/path/remove.js");
    createViewButtonResource(dc, pathResource.id, "modules/path/view.js");


}


async function initRoleResourceTable(dc: AuthDataContext) {
    let adminRole = await dc.roles.findOne(adminRoleId);
    let allResources = await dc.resources.find();
    adminRole.resources = allResources;

    await dc.roles.save(adminRole);
}

function createAddButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: Path[]) {
    let menuResource: Resource = {
        id: guid(),
        name: "添加",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data: { code: buttonCodes.add },
        api_paths: apiPaths
    }

    return dc.resources.save(menuResource);
}

function createEditButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths?: Path[]) {
    let data: ButtonResourceData = {
        code: buttonCodes.edit,
    }
    let menuResource: Resource = {
        id: guid(),
        name: "修改",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data,
        api_paths: apiPaths
    }

    return dc.resources.save(menuResource);
}

function createRemoveButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths?: Path[]) {
    let data: ButtonResourceData = {
        code: buttonCodes.delete,
    }
    let menuResource: Resource = {
        id: guid(),
        name: "删除",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data,
        api_paths: apiPaths
    }

    return dc.resources.save(menuResource);
}

function createViewButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths?: Path[]) {
    let data: ButtonResourceData = {
        code: buttonCodes.view,
    }
    let menuResource: Resource = {
        id: guid(),
        name: "查看",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data,
        api_paths: apiPaths
    }

    return dc.resources.save(menuResource);
}

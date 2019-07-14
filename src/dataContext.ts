import "reflect-metadata";
import { createConnection, EntityManager, Repository, Connection } from "typeorm";
import { createParameterDecorator } from "maishu-node-mvc";
import { conn } from './settings';
import { Role, Category, Resource, Token, User, UserLatestLogin, SMSRecord, Path, RoleResource } from "./entities";
import path = require("path");
import { constants, actionPaths } from "./common";
import { guid } from "./utility";

export class AuthDataContext {
    private entityManager: EntityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    tokens: Repository<Token>;
    users: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    paths: Repository<Path>;
    roleResources: Repository<RoleResource>;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository(Role);
        this.categories = this.entityManager.getRepository(Category);
        this.resources = this.entityManager.getRepository(Resource);
        this.tokens = this.entityManager.getRepository(Token);
        this.users = this.entityManager.getRepository(User);
        this.userLatestLogins = this.entityManager.getRepository(UserLatestLogin);
        this.smsRecords = this.entityManager.getRepository(SMSRecord);
        this.paths = this.entityManager.getRepository(Path);
        this.roleResources = this.entityManager.getRepository(RoleResource);
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
let anonymousRoleId = constants.anonymousRoleId;
let adminUserId = "240f103f-02a3-754c-f587-db122059fdfb";
let buttonControlsPath = "assert/controls/button.js";
let baseModuleResourceId = "AA3F1B10-311D-473E-A851-80D6FD8D91D3";
const buttonInvokePrefix = "func";

async function initRoleTable(dc: AuthDataContext) {
    let count = await dc.roles.count();
    if (count > 0)
        return;

    let adminRole: Role = {
        id: adminRoleId,
        name: "超级管理员",
        remark: "系统预设的超级管理员",
        create_date_time: new Date(Date.now()),
    }

    await dc.roles.save(adminRole);

    let anonymousRole: Role = {
        id: constants.anonymousRoleId,
        name: "匿名用户组",
        remark: "系统预设的匿名用户组",
        create_date_time: new Date(Date.now()),
    }

    await dc.roles.save(anonymousRole);
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
        role_id: adminRole.id
    }

    await dc.users.save(admin);

}

async function initResource(dc: AuthDataContext) {

    let count = await dc.resources.count();
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

    let baseModuleResource: Resource = {
        id: baseModuleResourceId,
        name: "基本功能",
        sort_number: 40,
        create_date_time: new Date(Date.now()),
        type: "module",
        api_paths: [
            { id: guid(), value: actionPaths.resource.list, create_date_time: new Date(Date.now()) },
        ]
    }

    await dc.resources.save(baseModuleResource);

    let loginResource: Resource = {
        id: guid(),
        name: "登录",
        sort_number: 100,
        create_date_time: new Date(Date.now()),
        type: "module",
        parent_id: baseModuleResource.id,
        api_paths: [
            { id: guid(), value: actionPaths.user.login, create_date_time: new Date(Date.now()) },
        ]
    }

    await dc.resources.save(loginResource);

    let registerResource: Resource = {
        id: guid(),
        name: "注册",
        sort_number: 200,
        create_date_time: new Date(Date.now()),
        type: "module",
        parent_id: baseModuleResource.id,
        api_paths: [
            { id: guid(), value: actionPaths.user.register, create_date_time: new Date(Date.now()) }
        ]
    }

    await dc.resources.save(registerResource);

    let forgetResource: Resource = {
        id: guid(),
        name: "找回密码",
        sort_number: 300,
        create_date_time: new Date(Date.now()),
        type: "module",
        parent_id: baseModuleResource.id,
        api_paths: [
            { id: guid(), value: actionPaths.user.resetPassword, create_date_time: new Date(Date.now()) }
        ]
    }

    await dc.resources.save(forgetResource);


    // 基本功能 结束
    //===============================================================================================

    let userResource: Resource = {
        id: userResourceId,
        name: "用户管理",
        sort_number: 80,
        type: "menu",
        create_date_time: new Date(Date.now()),
        page_path: `#${pageBasePath}/user/list`,
        icon: "icon-group",
        api_paths: [
            { id: guid(), value: actionPaths.user.list, create_date_time: new Date(Date.now()) },
        ]
    }
    await dc.resources.save(userResource);
    await createNormalAddButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [
        { id: guid(), value: actionPaths.user.add, create_date_time: new Date(Date.now()) }
    ]);
    await createSmallEditButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [
        { id: guid(), value: actionPaths.user.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.user.update, create_date_time: new Date(Date.now()) }
    ]);
    await createRemoveButtonResource(dc, userResourceId, `${buttonInvokePrefix}:deleteItem`, [
        { id: guid(), value: actionPaths.user.remove, create_date_time: new Date(Date.now()) }
    ]);

    let searchResource: Resource = {
        id: guid(),
        name: "搜索",
        sort_number: 80,
        type: "control",
        create_date_time: new Date(Date.now()),
        page_path: `${jsBasePath}/user/search-control.js`,
        data: { position: "top", code: "search" },
        parent_id: userResource.id,
        api_paths: [
            { id: guid(), value: actionPaths.user.list, create_date_time: new Date(Date.now()) },
        ]
    }

    await dc.resources.save(searchResource);


    //===============================================================================================

    let permissionResource: Resource = {
        id: permissionResourceId,
        name: "权限管理",
        sort_number: 100,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-lock",
    }
    await dc.resources.save(permissionResource);



    //===============================================================================================
    // 角色管理 开始

    let roleResource: Resource = {
        id: roleResourceId,
        name: "角色管理",
        sort_number: 200,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/role/list`,
        icon: "icon-sitemap",
        api_paths: [
            { id: guid(), value: actionPaths.role.list, create_date_time: new Date(Date.now()) }
        ]
    }
    await dc.resources.save(roleResource);
    await createNormalAddButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        { id: guid(), value: actionPaths.role.add, create_date_time: new Date(Date.now()) },
    ]);
    await createSmallEditButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        { id: guid(), value: actionPaths.role.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.role.update, create_date_time: new Date(Date.now()) },
    ]);
    await createRemoveButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        { id: guid(), value: actionPaths.role.remove, create_date_time: new Date(Date.now()) },
    ]);
    await createSmallViewButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        { id: guid(), value: actionPaths.role.item, create_date_time: new Date(Date.now()) },
    ]);

    let rolePermissionResource: Resource = {
        id: rolePermissionResourceId,
        name: "权限设置",
        sort_number: 40,
        type: "control",
        create_date_time: new Date(Date.now()),
        parent_id: roleResourceId,
        page_path: buttonControlsPath,//`${jsBasePath}/role/controls.js`,
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
    }
    await dc.resources.save(rolePermissionResource);

    await createNormalSaveButtonResource(dc, rolePermissionResource.id, `${buttonInvokePrefix}:save`, [
        { id: guid(), value: actionPaths.role.resource.set, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.role.resource.ids, create_date_time: new Date(Date.now()) }
    ])

    // 角色管理 结束
    //===============================================================================================

    let menuResource: Resource = {
        id: menuResourceId,
        name: "菜单管理",
        sort_number: 300,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/menu/list`,
        icon: "icon-tasks",
        api_paths: [
            { id: guid(), value: actionPaths.menu.list, create_date_time: new Date(Date.now()) }
        ]
    }
    await dc.resources.save(menuResource);
    await createNormalAddButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        { id: guid(), value: actionPaths.menu.add, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.resource.add, create_date_time: new Date(Date.now()) },
    ]);

    let menuAddButtonResource: Resource = {
        id: guid(),
        name: "添加控件",
        sort_number: 200,
        type: "control",
        create_date_time: new Date(Date.now()),
        parent_id: menuResource.id,
        page_path: `${jsBasePath}/menu/controls.js`,
        api_paths: [
            { id: guid(), value: actionPaths.menu.add, create_date_time: new Date(Date.now()) }
        ],
        data: { position: "top", code: "add_control" }
    }

    await dc.resources.save(menuAddButtonResource);


    await createSmallEditButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        { id: guid(), value: actionPaths.menu.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.menu.update, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.resource.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.resource.update, create_date_time: new Date(Date.now()) },
    ]);
    await createRemoveButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        { id: guid(), value: actionPaths.menu.remove, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.resource.remove, create_date_time: new Date(Date.now()) },
    ]);
    await createSmallViewButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        { id: guid(), value: actionPaths.menu.item, create_date_time: new Date(Date.now()) },
        { id: guid(), value: actionPaths.resource.item, create_date_time: new Date(Date.now()) },
    ]);

    let tokenResource: Resource = {
        id: tokenResourceId,
        name: "令牌管理",
        sort_number: 400,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/token/list`,
        icon: "icon-magic",
        api_paths: [
            { id: guid(), value: actionPaths.token.list, create_date_time: new Date(Date.now()) }
        ]
    }
    await dc.resources.save(tokenResource);
    await createNormalAddButtonResource(dc, tokenResourceId, `${jsBasePath}/token/controls.js`, [
        { id: guid(), value: actionPaths.token.add, create_date_time: new Date(Date.now()) },
    ]);



    let pathResource: Resource = {
        id: pathResourceId,
        name: "API 设置",
        sort_number: 500,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/path/list`,
        icon: "icon-rss",
        api_paths: [
            { id: guid(), value: actionPaths.path.list, create_date_time: new Date(Date.now()) },
            { id: guid(), value: actionPaths.resource.path.set, create_date_time: new Date(Date.now()) }
        ]
    }

    await dc.resources.save(pathResource);
    // await createNormalAddButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
    await createSmallEditButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
    await createSmallViewButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);

    let personalResource: Resource = {
        id: personalResourceId,
        name: "个人中心",
        sort_number: 600,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-user",
        api_paths: [
            { id: guid(), value: actionPaths.user.me, create_date_time: new Date(Date.now()) }
        ]
    }

    await dc.resources.save(personalResource);

    let changeMobileResource: Resource = {
        id: guid(),
        name: "修改手机号",
        sort_number: 800,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-tablet",
        parent_id: personalResource.id,
        page_path: `#${pageBasePath}/personal/change-mobile`,
        api_paths: [
            { id: guid(), value: actionPaths.sms.sendVerifyCode, create_date_time: new Date(Date.now()) },
        ]
    }

    await dc.resources.save(changeMobileResource);
    await createNormalSaveButtonResource(dc, changeMobileResource.id, `${buttonInvokePrefix}:save`, [
        { id: guid(), value: actionPaths.user.resetMobile, create_date_time: new Date(Date.now()) },
    ]);

    let changePasswordResource: Resource = {
        id: guid(),
        name: "修改密码",
        sort_number: 700,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-key",
        parent_id: personalResource.id,
        page_path: `#${pageBasePath}/personal/change-password`,
        api_paths: [
            { id: guid(), value: actionPaths.sms.sendVerifyCode, create_date_time: new Date(Date.now()) },
        ]
    }

    await dc.resources.save(changePasswordResource);
    await createNormalSaveButtonResource(dc, changePasswordResource.id, `${buttonInvokePrefix}:save`, [
        { id: guid(), value: actionPaths.user.resetPassword, create_date_time: new Date(Date.now()) },
    ]);
}


async function initRoleResourceTable(dc: AuthDataContext) {
    let adminRole = await dc.roles.findOne(adminRoleId);
    let allResources = await dc.resources.find();
    adminRole.resources = allResources;

    await dc.roles.save(adminRole);

    let roleResource: RoleResource = { role_id: anonymousRoleId, resource_id: baseModuleResourceId };
    await dc.roleResources.save(roleResource);
}

function createNormalAddButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: Path[]) {

    let execute_path: string;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }
    let menuResource: Resource = {
        id: guid(),
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
    }

    return dc.resources.save(menuResource);
}

function createNormalSaveButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: Path[]) {

    let execute_path: string;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }

    let menuResource: Resource = {
        id: guid(),
        name: "保存",
        sort_number: 100,
        type: "control",
        parent_id: parentId,
        page_path: path,
        create_date_time: new Date(Date.now()),
        data: {
            position: "top",
            code: "save",
            button: {
                execute_path: execute_path,
                className: "btn btn-primary",
                showButtonText: true,
                toast: "保存成功!",
            }
        },
        api_paths: apiPaths,
        icon: "icon-save",
    }

    return dc.resources.save(menuResource);
}

function createSmallEditButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths?: Path[]) {

    let execute_path: string;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }

    let menuResource: Resource = {
        id: guid(),
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
    }

    return dc.resources.save(menuResource);
}

function createRemoveButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths?: Path[]) {

    let execute_path: string;
    if (path.startsWith("func")) {
        execute_path = path;
        path = buttonControlsPath;
    }

    let menuResource: Resource = {
        id: guid(),
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
    }

    return dc.resources.save(menuResource);
}

function createSmallViewButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: Path[]) {
    let menuResource: Resource = {
        id: guid(),
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
    }

    return dc.resources.save(menuResource);
}

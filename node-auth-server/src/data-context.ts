import "reflect-metadata";
import { createConnection, EntityManager, Repository, Connection, Db } from "typeorm";
import { conn } from './settings';
import { Role, Category, Resource, Token, User, UserLatestLogin, SMSRecord, Path, RoleResource, ResourcePath } from "./entities";
import path = require("path");
import { constants, actionPaths } from "./common";
import { guid } from "./utility";
import { errors } from "./errors";
import { DH_CHECK_P_NOT_PRIME } from "constants";

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
    resourcePaths: Repository<ResourcePath>;

    baseModuleResourceId: string;

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
        this.resourcePaths = this.entityManager.getRepository(ResourcePath);

        this.baseModuleResourceId = baseModuleResourceId;
    }

    public async createTopButtonResource(args: {
        parentResourceId: string, name: string, className: string,
        icon: string, invokeMethodName: string, apiPaths: string[],
        showButtonText?: boolean,
        sort_number?: number,
    }) {

        if (args.sort_number == null) {
            let r = await this.resources.createQueryBuilder()
                .select("max(sort_number) as max_sort_number").getRawOne();

            args.sort_number = (r["max_sort_number"] || 0) + 100;
        }

        if (args.showButtonText == null)
            args.showButtonText = true;

        let apiPaths: Path[] = null;
        if (args.apiPaths) {
            apiPaths = await Promise.all(args.apiPaths.map(o => getPath(this, o)));
        }
        let resource: Resource = {
            id: guid(), name: args.name,
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
        }

        return this.resources.save(resource);
    }

    public createMenuItem(args: {
        id: string, name: string, url?: string,
        icon?: string, sortNumber?: number, parentId?: string,
    }) {
        let resource: Resource = {
            id: args.id, create_date_time: new Date(Date.now()),
            name: args.name, icon: args.icon, type: "menu", sort_number: args.sortNumber,
            page_path: args.url, parent_id: args.parentId
        }

        return this.resources.save(resource);
    }

    public async appendPathsToResource(paths: string[], resourceId: string) {
        if (paths == null)
            throw errors.argumentNull("paths");

        if (!Array.isArray(paths))
            throw errors.argumentTypeIncorrect("paths", "Array");

        if (!resourceId)
            throw errors.argumentNull("resourceId");

        if (paths.length == 0)
            return;

        let allPaths = await this.paths.find();
        let allPathStrings = allPaths.map(o => o.value);

        // 过滤掉已存在的路径
        paths = paths.filter(p => allPathStrings.indexOf(p) < 0);

        let pathObjects: Path[] = paths.map(o => ({ id: guid(), value: o, create_date_time: new Date(Date.now()) }));
        await this.paths.save(pathObjects);
        let resourcePaths: ResourcePath[] = pathObjects.map(o => ({ resource_id: resourceId, path_id: o.id }));
        await this.resourcePaths.save(resourcePaths);
    }

    public async initDatabase(adminMobile: string, adminPassword: string) {
        return initDatabase(this, adminMobile, adminPassword);
    }

    public guid() {
        return guid();
    }


    async dispose() {
        // await this.entityManager.connection.close();
    }
}



async function createDataContext(name: string, synchronize: boolean, entitiesDirectory?: string): Promise<AuthDataContext> {

    let entities: string[] = [path.join(__dirname, "entities.js")]
    if (entitiesDirectory) {
        entities.push(path.join(entitiesDirectory, "*.js"));
    }
    let connection = await createConnection({
        type: "mysql",
        host: conn.auth.host,
        port: conn.auth.port,
        username: conn.auth.user,
        password: conn.auth.password,
        database: conn.auth.database,
        synchronize: true,
        logging: true,
        connectTimeout: 1000,
        entities,
        name: name
    })

    let dc = new AuthDataContext(connection.manager)
    return dc
}


export let getDataContext = (function () {
    var dc: AuthDataContext = null;
    return async function (synchronize?: boolean, entitiesDirectory?: string) {
        if (synchronize == null)
            synchronize = false;

        if (dc == null) {
            dc = await createDataContext("shop_auth", synchronize, entitiesDirectory);
        }

        return dc;
    }
})()

async function initDatabase(dc: AuthDataContext, adminMobile: string, adminPassword: string) {
    if (!dc) throw errors.argumentNull("dc");
    try {
        await initRoleTable(dc);
        await initResource(dc);
        await initRoleResourceTable(dc);
        await initUserTable(dc, adminMobile, adminPassword);
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

async function initUserTable(dc: AuthDataContext, adminMobile: string, adminPassword) {
    let count = await dc.users.count();
    if (count > 0)
        return;

    let adminRole = await dc.roles.findOne(adminRoleId);

    let admin: User = {
        id: adminUserId,
        mobile: adminMobile,
        password: adminPassword,
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
        sort_number: 11000,
        create_date_time: new Date(Date.now()),
        type: "module",
        api_paths: await Promise.all([
            actionPaths.resource.list,
            actionPaths.role.item,
        ].map(p => getPath(dc, p)))
    }

    await dc.resources.save(baseModuleResource);


    let loginResource: Resource = {
        id: guid(),
        name: "登录",
        sort_number: 11100,
        create_date_time: new Date(Date.now()),
        type: "module",
        parent_id: baseModuleResourceId,
        api_paths: await Promise.all([actionPaths.user.login].map(p => getPath(dc, p)))
    }

    await dc.resources.save(loginResource);

    let registerResource: Resource = {
        id: guid(),
        name: "注册",
        sort_number: 11200,
        create_date_time: new Date(Date.now()),
        type: "module",
        parent_id: baseModuleResource.id,
        api_paths: await Promise.all([actionPaths.user.register].map(p => getPath(dc, p)))
    }

    await dc.resources.save(registerResource);

    let forgetResource: Resource = {
        id: guid(),
        name: "找回密码",
        sort_number: 11300,
        create_date_time: new Date(Date.now()),
        type: "module",
        parent_id: baseModuleResource.id,
        api_paths: await Promise.all([actionPaths.user.resetPassword].map(p => getPath(dc, p)))
        //  [
        //     { id: guid(), value: actionPaths.user.resetPassword, create_date_time: new Date(Date.now()) }
        // ]
    }

    await dc.resources.save(forgetResource);


    // 基本功能 结束
    //===============================================================================================

    let userResource: Resource = {
        id: userResourceId,
        name: "用户管理",
        sort_number: 12000,
        type: "menu",
        create_date_time: new Date(Date.now()),
        page_path: `#${pageBasePath}/user/list`,
        icon: "icon-group",
        api_paths: await Promise.all([actionPaths.user.list].map(p => getPath(dc, p)))
    }
    await dc.resources.save(userResource);
    await createNormalAddButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`,
        [actionPaths.user.add]
    );
    await createSmallEditButtonResource(dc, userResourceId, `${buttonInvokePrefix}:showItem`, [
        actionPaths.user.item,
        actionPaths.user.update
    ]);
    await createRemoveButtonResource(dc, userResourceId, `${buttonInvokePrefix}:deleteItem`, [
        actionPaths.user.remove
    ]);

    let searchResource: Resource = {
        id: guid(),
        name: "搜索",
        sort_number: 80,
        type: "control",
        create_date_time: new Date(Date.now()),
        page_path: `${jsBasePath}/user/search-control.js`,
        data: { position: "top-right", code: "search" },
        parent_id: userResource.id,
        api_paths: await Promise.all([actionPaths.user.list].map(p => getPath(dc, p)))
    }

    await dc.resources.save(searchResource);


    //===============================================================================================

    let permissionResource: Resource = {
        id: permissionResourceId,
        name: "权限管理",
        sort_number: 13000,
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
        sort_number: 13100,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/role/list`,
        icon: "icon-sitemap",
        api_paths: await Promise.all([actionPaths.role.list].map(p => getPath(dc, p)))
        //  [
        //     { id: guid(), value: actionPaths.role.list, create_date_time: new Date(Date.now()) }
        // ]
    }
    await dc.resources.save(roleResource);
    await createNormalAddButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`,
        [actionPaths.role.add]
    );
    await createSmallEditButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        actionPaths.role.item,
        actionPaths.role.update,
    ]);
    await createRemoveButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        actionPaths.role.remove,
    ]);
    await createSmallViewButtonResource(dc, roleResourceId, `${jsBasePath}/role/controls.js`, [
        actionPaths.role.item,
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
        actionPaths.role.resource.set,
        actionPaths.role.resource.ids
    ])

    // 角色管理 结束
    //===============================================================================================

    let menuResource: Resource = {
        id: menuResourceId,
        name: "菜单管理",
        sort_number: 13200,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/menu/list`,
        icon: "icon-tasks",
        api_paths: await Promise.all([actionPaths.menu.list].map(p => getPath(dc, p)))
        // [
        //     { id: guid(), value: actionPaths.menu.list, create_date_time: new Date(Date.now()) }
        // ]
    }
    await dc.resources.save(menuResource);
    await createNormalAddButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`,
        [actionPaths.menu.add, actionPaths.resource.add,]
    );

    let menuAddButtonResource: Resource = {
        id: guid(),
        name: "添加控件",
        sort_number: 200,
        type: "control",
        create_date_time: new Date(Date.now()),
        parent_id: menuResource.id,
        page_path: `${jsBasePath}/menu/controls.js`,
        api_paths: await Promise.all([actionPaths.menu.add].map(p => getPath(dc, p))),
        //  [
        //     { id: guid(), value: actionPaths.menu.add, create_date_time: new Date(Date.now()) }
        // ],
        data: { position: "top-right", code: "add_control" }
    }

    await dc.resources.save(menuAddButtonResource);


    await createSmallEditButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        actionPaths.menu.item,
        actionPaths.menu.update,
        actionPaths.resource.item,
        actionPaths.resource.update,
    ]);
    await createRemoveButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        actionPaths.menu.remove,
        actionPaths.resource.remove,
    ]);
    await createSmallViewButtonResource(dc, menuResource.id, `${jsBasePath}/menu/controls.js`, [
        actionPaths.menu.item,
        actionPaths.resource.item,
    ]);

    let tokenResource: Resource = {
        id: tokenResourceId,
        name: "令牌管理",
        sort_number: 13400,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/token/list`,
        icon: "icon-magic",
        api_paths: await Promise.all([actionPaths.token.list].map(p => getPath(dc, p)))
    }
    await dc.resources.save(tokenResource);
    await createNormalAddButtonResource(dc, tokenResourceId, `${jsBasePath}/token/controls.js`,
        [actionPaths.token.add]
    );



    let pathResource: Resource = {
        id: pathResourceId,
        name: "API 设置",
        sort_number: 13500,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        page_path: `#${pageBasePath}/path/list`,
        icon: "icon-rss",
        api_paths: await Promise.all([
            actionPaths.path.list, actionPaths.path.listByResourceIds,
            actionPaths.resource.path.set, actionPaths.resource_path.list,
        ].map(p => getPath(dc, p)))
        // [
        //     { id: guid(), value: actionPaths.path.list, create_date_time: new Date(Date.now()) },
        //     { id: guid(), value: actionPaths.resource.path.set, create_date_time: new Date(Date.now()) }
        // ]
    }

    await dc.resources.save(pathResource);
    await createSmallEditButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);
    await createSmallViewButtonResource(dc, pathResource.id, `${jsBasePath}/path/controls.js`, []);

    let personalResource: Resource = {
        id: personalResourceId,
        name: "个人中心",
        sort_number: 14000,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-user",
        api_paths: await Promise.all([actionPaths.user.me].map(p => getPath(dc, p)))
    }

    await dc.resources.save(personalResource);

    let changeMobileResource: Resource = {
        id: guid(),
        name: "修改手机号",
        sort_number: 14100,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-tablet",
        parent_id: personalResource.id,
        page_path: `#${pageBasePath}/personal/change-mobile`,
        api_paths: await Promise.all([actionPaths.sms.sendVerifyCode].map(p => getPath(dc, p)))
    }

    await dc.resources.save(changeMobileResource);
    await createNormalSaveButtonResource(dc, changeMobileResource.id, `${buttonInvokePrefix}:save`, [
        actionPaths.user.resetMobile
    ]);

    let changePasswordResource: Resource = {
        id: guid(),
        name: "修改密码",
        sort_number: 14200,
        type: "menu",
        create_date_time: new Date(Date.now()),
        icon: "icon-key",
        parent_id: personalResource.id,
        page_path: `#${pageBasePath}/personal/change-password`,
        api_paths: await Promise.all([actionPaths.sms.sendVerifyCode].map(p => getPath(dc, p)))
    }

    await dc.resources.save(changePasswordResource);
    await createNormalSaveButtonResource(dc, changePasswordResource.id, `${buttonInvokePrefix}:save`, [
        actionPaths.user.resetPassword,
    ]);
}


async function initRoleResourceTable(dc: AuthDataContext) {
    // let adminRole = await dc.roles.findOne(adminRoleId);
    // let allResources = await dc.resources.find();
    // adminRole.resources = allResources;

    // await dc.roles.save(adminRole);

    dc.roleResources.delete({});
    let roleResource: RoleResource = { role_id: anonymousRoleId, resource_id: baseModuleResourceId };
    await dc.roleResources.save(roleResource);
}

async function createNormalAddButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: string[]) {

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
            position: "top-right",
            code: "add",
            button: {
                className: "btn btn-primary",
                showButtonText: true,
                title: "点击添加",
                execute_path
            }
        },
        api_paths: await Promise.all(apiPaths.map(p => getPath(dc, p))),
        icon: "icon-plus"
    }

    return dc.resources.save(menuResource);
}

async function createNormalSaveButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: string[]) {

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
            position: "top-right",
            code: "save",
            button: {
                execute_path: execute_path,
                className: "btn btn-primary",
                showButtonText: true,
                toast: "保存成功!",
            }
        },
        api_paths: await Promise.all(apiPaths.map(p => getPath(dc, p))),
        icon: "icon-save",
    }

    return dc.resources.save(menuResource);
}

async function createSmallEditButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: string[]) {

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
        api_paths: await Promise.all(apiPaths.map(p => getPath(dc, p))),
        icon: "icon-pencil"
    }

    return dc.resources.save(menuResource);
}

async function createRemoveButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: string[]) {
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
        api_paths: await Promise.all(apiPaths.map(p => getPath(dc, p))),
        icon: "icon-trash"
    }

    return dc.resources.save(menuResource);
}

async function createSmallViewButtonResource(dc: AuthDataContext, parentId: string, path: string, apiPaths: string[]) {
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
        api_paths: await Promise.all(apiPaths.map(p => getPath(dc, p))),
        icon: "icon-eye-open"
    }

    return dc.resources.save(menuResource);
}

async function getPath(dc: AuthDataContext, value: string): Promise<Path> {
    if (!dc) throw errors.argumentNull("dc");

    let path = await dc.paths.findOne({ value: value });
    if (path == null) {
        path = { id: guid(), value, create_date_time: new Date(Date.now()) }
    }

    return path;
}



import "reflect-metadata";
import { createConnection, EntityManager, Repository } from "typeorm";
import { createParameterDecorator } from "maishu-node-mvc";
import { conn } from './settings';
import { Role, Category, Resource, Token, User, UserLatestLogin } from "./entities";
import path = require("path");
import { guid } from "./database";

export class AuthDataContext {
    private entityManager: EntityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    tokens: Repository<Token>;
    user: Repository<User>;
    userLatestLogins: Repository<UserLatestLogin>;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository(Role);
        this.categories = this.entityManager.getRepository(Category);
        this.resources = this.entityManager.getRepository(Resource);
        this.tokens = this.entityManager.getRepository(Token);
        this.user = this.entityManager.getRepository(User);
        this.userLatestLogins = this.entityManager.getRepository(UserLatestLogin);
    }

    async dispose() {
        await this.entityManager.connection.close();
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


export async function createDataContext(name?: string): Promise<AuthDataContext> {
    let c = await createConnection({
        type: "mysql",
        host: conn.auth.host,
        port: conn.auth.port,
        username: conn.auth.user,
        password: conn.auth.password,
        database: conn.auth.database,
        synchronize: true,
        logging: true,
        entities: [
            path.join(__dirname, "entities.js")
        ],
        name: name
    })

    let dc = new AuthDataContext(c.manager)
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

let adminRoleId = "535e89a2-5b17-4e65-fecb-0259015b1a9b";
let adminUserId = "240f103f-02a3-754c-f587-db122059fdfb";

async function initRoleTable(dc: AuthDataContext) {
    let count = await dc.roles.count();
    if (count > 0)
        return;

    let adminRole: Role = {
        id: adminRoleId,
        name: "超级管理员",
        remark: "系统预设的超级管理员",
        create_date_time: new Date(Date.now())
    }

    await dc.roles.save(adminRole);
}

async function initUserTable(dc: AuthDataContext) {
    let count = await dc.user.count();
    if (count > 0)
        return;

    let adminRole = await dc.roles.findOne(adminRoleId);

    let admin: User = {
        id: adminUserId,
        mobile: "18502146746",
        password: "22",
        create_date_time: new Date(Date.now()),
        roles: [adminRole]
    }

    return dc.user.save(admin)
}

async function initResource(dc: AuthDataContext) {

    let count = await dc.resources.count();
    if (count > 0)
        return;

    let permissionResourceId = "5d626d85-45fd-9128-1f54-a27ba55e573c";
    let roleResourceId = "212484f1-e500-7e5a-b409-cb9221a36a65";
    let menuResourceId = "8CA2AF51-BF5B-42A5-8E9E-2B9E48E4BFC0";

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
        path: "role/list",
    }

    let menuResource: Resource = {
        id: menuResourceId,
        name: "菜单管理",
        sort_number: 300,
        type: "menu",
        create_date_time: new Date(Date.now()),
        parent_id: permissionResourceId,
        path: "menu/list"
    }

    await dc.resources.save(permissionResource);

    await dc.resources.save(roleResource);
    await createAddButtonResource(dc, roleResourceId, "role/item");
    await createModifyButtonResource(dc, roleResourceId, "role/item");
    await createRemoveButtonResource(dc, roleResourceId, "javascript:remove");
    await createViewButtonResource(dc, roleResourceId, "role/item");

    await dc.resources.save(menuResource);
    await createAddButtonResource(dc, menuResource.id, "menu/item");
    await createModifyButtonResource(dc, menuResource.id, "menu/item");
    await createRemoveButtonResource(dc, menuResource.id, "javascript:remove");
    await createViewButtonResource(dc, menuResource.id, "menu/item");
}


async function initRoleResourceTable(dc: AuthDataContext) {
    let adminRole = await dc.roles.findOne(adminRoleId);
    let allResources = await dc.resources.find();
    adminRole.resources = allResources;

    await dc.roles.save(adminRole);
}

function createAddButtonResource(dc: AuthDataContext, parentId: string, path: string) {
    let menuResource: Resource = {
        id: guid(),
        name: "添加",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    }

    return dc.resources.save(menuResource);
}

function createModifyButtonResource(dc: AuthDataContext, parentId: string, path: string) {
    let menuResource: Resource = {
        id: guid(),
        name: "修改",
        sort_number: 100,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    }

    return dc.resources.save(menuResource);
}

function createRemoveButtonResource(dc: AuthDataContext, parentId: string, path: string) {
    let menuResource: Resource = {
        id: guid(),
        name: "删除",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    }

    return dc.resources.save(menuResource);
}

function createViewButtonResource(dc: AuthDataContext, parentId: string, path: string) {
    let menuResource: Resource = {
        id: guid(),
        name: "查看",
        sort_number: 200,
        type: "button",
        parent_id: parentId,
        path,
        create_date_time: new Date(Date.now()),
    }

    return dc.resources.save(menuResource);
}

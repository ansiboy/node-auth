import "reflect-metadata";
// import { ConnectionConfig } from "mysql";
import { EntityManager, Repository, DataContext, DataHelper, ConnectionOptions } from "maishu-node-data";
import path = require("path");
import { TokenData, Role, UserRole, MenuItemRecord } from "./entities";
import { createParameterDecorator } from "maishu-node-mvc";
import { g, roleIds, userIds } from "./global";
import { getTokenData } from "./filters/authenticate";

export interface SelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}

export interface SelectResult<T> {
    dataItems: T[];
    totalRowCount: number;
}

export class AuthDataContext extends DataContext {

    tokenDatas: Repository<TokenData>;
    roles: Repository<Role>;
    userRoles: Repository<UserRole>;
    menuItemRecords: Repository<MenuItemRecord>;

    static entitiesPath = path.join(__dirname, "entities.js");

    constructor(entityManager: EntityManager) {
        super(entityManager);

        this.tokenDatas = this.manager.getRepository(TokenData);
        this.roles = this.manager.getRepository(Role);
        this.userRoles = this.manager.getRepository(UserRole);
        this.menuItemRecords = this.manager.getRepository(MenuItemRecord);
    }
}

export async function createDataContext(connConfig: ConnectionOptions): Promise<AuthDataContext> {
    return DataHelper.createDataContext(AuthDataContext, connConfig);
}

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        console.assert(g.settings.db != null);
        let dc = await createDataContext(g.settings.db);
        return dc
    }
)

export async function initDatabase(connConfig: ConnectionOptions) {
    let dc = await createDataContext(connConfig);

    let adminRole: Role = {
        id: roleIds.admin,
        name: "管理员",
        remark: "系统预设的管理员",
        create_date_time: new Date(Date.now()),
    };

    await dc.roles.save(adminRole);

    let anonymousRole: Role = {
        id: roleIds.anonymous,
        name: "匿名用户组",
        remark: "系统预设的匿名用户组",
        create_date_time: new Date(Date.now()),
    }

    await dc.roles.save(anonymousRole);

    let normalUserRole: Role = {
        id: roleIds.normalUser,
        name: "普通用户",
        remark: "",
        create_date_time: new Date(Date.now()),
    }

    await dc.roles.save(normalUserRole);

    let userRole: UserRole = {
        user_id: userIds.admin,
        role_id: roleIds.admin,
    }

    await dc.userRoles.save(userRole);
}

export let currentUserId = createParameterDecorator(async (context) => {
    let { req, res } = context;
    let tokenData = await getTokenData(req, res);
    if (!tokenData) {
        tokenData = await getTokenData(req, res);
        return null;
    }

    return tokenData.user_id;
})
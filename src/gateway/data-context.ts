import "reflect-metadata";
import { ConnectionConfig } from "mysql";
import { createConnection, EntityManager, Repository, getConnection, ConnectionOptions, getConnectionManager } from "maishu-node-data";
import path = require("path");
import fs = require("fs");
import { TokenData, Role, UserRole, MenuItemRecord } from "./entities";
import { createParameterDecorator, getLogger } from "maishu-node-mvc";
import { g, constants, roleIds, userIds } from "./global";
import { getTokenData } from "./filters/authenticate";
import { DataContext, DataHelper } from "maishu-node-data";

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


    static async list<T>(repository: Repository<T>, options: {
        selectArguments?: SelectArguments, relations?: string[],
        fields?: Extract<keyof T, string>[]
    }): Promise<SelectResult<T>> {

        let { selectArguments, relations, fields } = options;
        selectArguments = selectArguments || {};

        let order: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 };
        if (!selectArguments.sortExpression) {
            selectArguments.sortExpression = "create_date_time desc"
        }

        let arr = selectArguments.sortExpression.split(/\s+/).filter(o => o);
        console.assert(arr.length > 0)
        order = {};
        order[arr[0]] = arr[1].toUpperCase() as any;

        let [items, count] = await repository.findAndCount({
            where: selectArguments.filter, relations,
            skip: selectArguments.startRowIndex,
            take: selectArguments.maximumRows,
            order: order,
            select: fields,

        });

        return { dataItems: items, totalRowCount: count } as SelectResult<T>
    }

}

export async function createDataContext(connConfig: ConnectionConfig): Promise<AuthDataContext> {
    return DataHelper.createDataContext(AuthDataContext, connConfig);
}

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        console.assert(g.settings.db != null);
        let dc = await createDataContext(g.settings.db);
        return dc
    }
)


export async function dataList<T>(repository: Repository<T>, options: {
    selectArguments?: SelectArguments, relations?: string[],
    fields?: Extract<keyof T, string>[]
}): Promise<SelectResult<T>> {

    let { selectArguments, relations, fields } = options;
    selectArguments = selectArguments || {};

    let order: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 };
    if (!selectArguments.sortExpression) {
        selectArguments.sortExpression = "create_date_time desc"
    }

    let arr = selectArguments.sortExpression.split(/\s+/).filter(o => o);
    console.assert(arr.length > 0)
    order = {};
    order[arr[0]] = arr[1].toUpperCase() as any;

    let [items, count] = await repository.findAndCount({
        where: selectArguments.filter, relations,
        skip: selectArguments.startRowIndex,
        take: selectArguments.maximumRows,
        order: order,
        select: fields,

    });

    return { dataItems: items, totalRowCount: count } as SelectResult<T>
}

export async function initDatabase(connConfig: ConnectionConfig) {
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

export let currentUserId = createParameterDecorator(async (req, res) => {
    let tokenData = await getTokenData(req, res);
    if (!tokenData)
        return null;

    return tokenData.user_id;
})
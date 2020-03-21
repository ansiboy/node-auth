import "reflect-metadata";
import { EntityManager, Repository, DataContext, DataHelper } from "maishu-node-data";
import { TokenData, Role, UserRole } from "./entities";
import { createParameterDecorator, serverContext } from "maishu-node-mvc";
import { roleIds, userIds } from "./global";
import { getTokenData } from "./filters/authenticate";
import { ServerContext, ServerContextData } from "./types";
import path = require("path");

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

    constructor(entityManager: EntityManager) {
        super(entityManager);

        this.tokenDatas = this.manager.getRepository(TokenData);
        this.roles = this.manager.getRepository(Role);
        this.userRoles = this.manager.getRepository(UserRole);
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

    /**
     * 获取指定用户的角色 ID
     * @param userId 指定的用户 ID
     */
    static async getUserRoleIds(userId: string, contextData: ServerContextData): Promise<string[]> {
        //TODO: 缓存 roleids
        let dc = await createDataContext(contextData);
        let userRoles = await dc.userRoles.find({ user_id: userId });
        return userRoles.map(o => o.role_id);
    }

}

// let connections: { [dbName: string]: Connection } = {};

export async function createDataContext(contextData: ServerContextData): Promise<AuthDataContext> {
    let dc = await DataHelper.createDataContext(AuthDataContext, contextData.db, path.join(__dirname, "entities.js"));
    return dc;
}

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async (req, res, context: ServerContext) => {
        console.assert(context.data != null);
        let dc = await createDataContext(context.data);
        return dc
    }
)

export async function initDatabase(contextData: ServerContextData) {
    let dc = await createDataContext(contextData);

    let adminRole: Role = {
        id: roleIds.admin,
        name: "管理员",
        remark: "系统预设的管理员",
        create_date_time: new Date(Date.now()),
        readonly: true
    };

    await dc.roles.save(adminRole);

    let userRole: UserRole = {
        user_id: userIds.admin,
        role_id: roleIds.admin,
    }

    await dc.userRoles.save(userRole);
}

export let currentUserId = createParameterDecorator(async (req, res, context: ServerContext) => {
    let tokenData = await getTokenData(req, res, context.data);
    if (!tokenData)
        return null;

    return tokenData.user_id;
})
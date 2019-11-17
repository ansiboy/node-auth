import "reflect-metadata";
import { ConnectionConfig } from "mysql";
import { createConnection, EntityManager, Repository, Connection, Db, getConnection, ConnectionOptions } from "typeorm";
import path = require("path");
import { TokenData } from "./entities";
import { createParameterDecorator } from "maishu-node-mvc";
import { g } from "./global";

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

export class AuthDataContext {

    tokenDatas: Repository<TokenData>;
    entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;

        this.tokenDatas = this.entityManager.getRepository(TokenData);
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

let connections: { [dbName: string]: Connection } = {};

export async function createDataContext(conn: ConnectionConfig): Promise<AuthDataContext> {

    let connection = connections[conn.database];
    if (connection == null) {
        let entities: string[] = [path.join(__dirname, "entities.js")]
        let dbOptions: ConnectionOptions = {
            type: "mysql",
            host: conn.host,
            port: conn.port,
            username: conn.user,
            password: conn.password,
            database: conn.database,
            synchronize: true,
            logging: false,
            connectTimeout: 3000,
            entities,
            name: conn.database
        }

        connection = await createConnection(dbOptions);
        connections[conn.database] = connection;
    }


    connection = getConnection(conn.database);

    let dc = new AuthDataContext(connection.manager)
    return dc


}

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        console.assert(g.settings.db != null);
        let dc = await createDataContext(g.settings.db);
        return dc
    }
)
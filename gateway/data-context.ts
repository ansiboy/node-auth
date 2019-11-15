import "reflect-metadata";
import { ConnectionConfig } from "mysql";
import { createConnection, EntityManager, Repository, Connection, Db, getConnection, ConnectionOptions } from "typeorm";
import path = require("path");
import { TokenData } from "./entities";

export class AuthDataContext {

    tokenDatas: Repository<TokenData>;
    entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;

        this.tokenDatas = this.entityManager.getRepository(TokenData);
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
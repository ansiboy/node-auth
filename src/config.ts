import { ConnectionOptions } from "maishu-node-data";

interface Config {
    db: {
        permission: ConnectionOptions,
        gateway: ConnectionOptions,
    }
}

let mysqlDB: Config["db"] = {
    permission: {
        type: "mysql",
        username: "root",
        password: "81263",
        database: "node_auth_permission",
        host: "localhost",
        port: 3306,
        debug: null,
    },
    gateway: {
        type: "mysql",
        username: "root",
        password: "81263",
        database: "node_auth_gateway",
        host: "localhost",
        port: 3306,
        debug: null
    }
};

let sqliteDB: Config["db"] = {
    permission: {
        type: "sqlite",
        database: "node_auth_permission.db",
    },
    gateway: {
        type: "sqlite",
        database: "node_auth_gateway.db",
    }
}

let config: Config = {
    db: sqliteDB
}

export default config;
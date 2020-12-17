import { ConnectionOptions } from "maishu-node-data";
import { initDatabase } from "./gateway/data-context";

import * as path from "path";
import * as fs from "fs";

const configFilePath = path.join(__dirname, "../config.json");


export interface Config {
    gatewayPort: number,
    db: {
        permission: ConnectionOptions,
        gateway: ConnectionOptions,
    }
}


export async function loadConfig() {
    let config: Config;
    if (!configFilePath) {
        config = createDefaultConfig();
        saveConfig(config);

        await initDatabase(config.db.gateway);
    }
    else {
        config = JSON.parse(fs.readFileSync(configFilePath).toString());

    }
    return config;
}

export function saveConfig(config: Config) {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, "    "));
}

export function createDefaultConfig(): Config {
    return {
        gatewayPort: 2857,
        db: {
            permission: {
                type: "sqlite",
                database: path.join(__dirname, "../db/node_auth_permission.db"),
            },
            gateway: {
                type: "sqlite",
                database: path.join(__dirname, "../db/node_auth_gateway.db"),
            }
        }
    }
}

// let mysqlDB: Config["db"] = {
//     permission: {
//         type: "mysql",
//         username: "root",
//         password: "81263",
//         database: "node_auth_permission",
//         host: "localhost",
//         port: 3306,
//         debug: null,
//     },
//     gateway: {
//         type: "mysql",
//         username: "root",
//         password: "81263",
//         database: "node_auth_gateway",
//         host: "localhost",
//         port: 3306,
//         debug: null
//     }
// };

// let sqliteDB: Config["db"] = {
//     permission: {
//         type: "sqlite",
//         database: path.join(__dirname, "../db/node_auth_permission.db"),
//     },
//     gateway: {
//         type: "sqlite",
//         database: path.join(__dirname, "../db/node_auth_gateway.db"),
//     }
// }

// let config: Config = {
//     db: sqliteDB
// }

// export default config;
import { ConnectionConfig, Connection, createConnection, MysqlError } from "mysql";
import { getLogger } from "maishu-node-mvc";

export class DataContext {
    constructor(connConfig: ConnectionConfig) {
        this.checkDatabase(connConfig);
    }

    private checkDatabase(connConfig: ConnectionConfig) {
        let dbName = connConfig.database;
        connConfig = Object.assign({}, connConfig);
        connConfig.database = "mysql";

        let conn = createConnection(connConfig);
        let cmd = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`;
        return new Promise<boolean>(function (resolve, reject) {
            conn.query(cmd, function (err?: MysqlError, result?: Array<any>) {
                if (err) {
                    reject(err);
                    console.log("err")
                    return;
                }

                if (result.length == 0) {
                    conn.query(`CREATE DATABASE ${dbName}`, function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve();
                    });
                }

                resolve();
            });
        })
    }

}
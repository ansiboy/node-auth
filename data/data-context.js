"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
class DataContext {
    constructor(connConfig) {
        this.checkDatabase(connConfig);
    }
    checkDatabase(connConfig) {
        let dbName = connConfig.database;
        connConfig = Object.assign({}, connConfig);
        connConfig.database = "mysql";
        let conn = mysql_1.createConnection(connConfig);
        let cmd = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`;
        return new Promise(function (resolve, reject) {
            conn.query(cmd, function (err, result) {
                if (err) {
                    reject(err);
                    console.log("err");
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
        });
    }
}
exports.DataContext = DataContext;

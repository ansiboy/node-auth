"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const settings = require("./settings");
function connect(callback) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let conn = mysql.createConnection(settings.conn.auth);
        callback(conn)
            .then((result) => {
            conn.end();
            resolve(result);
        })
            .catch(err => {
            conn.end();
            reject(err);
        });
    }));
}
exports.connect = connect;
function execute(conn, sql, value) {
    return new Promise((resolve, reject) => {
        conn.query(sql, value, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }
            if (Array.isArray(rows) && fields != null) {
                fields.forEach(field => {
                    if (field.type != 245 /* JSON */)
                        return;
                    rows.forEach(item => {
                        let value = item[field.name];
                        if (value != null)
                            item[field.name] = JSON.parse(value);
                    });
                });
            }
            resolve([rows, fields]);
        });
    });
}
exports.execute = execute;
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
exports.guid = guid;
//# sourceMappingURL=database.js.map
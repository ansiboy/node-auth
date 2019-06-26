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
const maishu_node_mvc_1 = require("maishu-node-mvc");
const maishu_mysql_helper_1 = require("maishu-mysql-helper");
const errors_1 = require("./errors");
exports.connection = maishu_node_mvc_1.createParameterDecorator(() => __awaiter(this, void 0, void 0, function* () {
    let conn = mysql.createConnection(settings.conn.auth);
    return conn;
}), (conn) => {
    console.assert(conn != null);
    conn.end();
});
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
function list(conn, tableName, args) {
    return __awaiter(this, void 0, void 0, function* () {
        args = Object.assign({
            startRowIndex: 0, maximumRows: 100
        }, args || {});
        if (args.filter) {
            let expr = maishu_mysql_helper_1.Parser.parseExpression(args.filter);
            if (expr.type != "Binary") {
                // throw errors.parseFilterFail(args.filter)
                throw new Error('Parse filter fail');
            }
        }
        if (args.sortExpression) {
            let expr = maishu_mysql_helper_1.Parser.parseOrderExpression(args.sortExpression);
            if (expr.type != "Order") {
                // throw errors.parseSortFail(args.sortExpression)
                throw new Error('Parse sort fail');
            }
        }
        else {
            args.sortExpression = 'create_date_time desc';
        }
        // if (conn.applicationId) {
        //     args.filter = args.filter ?
        //         `${args.filter} and application_id = '${conn.applicationId}'` :
        //         `application_id = '${conn.applicationId}'`
        // }
        let sql_filter = args.filter ? 'where ' + args.filter : '';
        let p1 = new Promise((resolve, reject) => {
            let sql = `select * from ${tableName} ${sql_filter}
                   order by ${args.sortExpression}
                   limit ${args.maximumRows} offset ${args.startRowIndex}`;
            conn.query(sql, args, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                fields.forEach(field => {
                    if (field.type != 245 /* JSON */)
                        return;
                    rows.forEach(item => {
                        let value = item[field.name];
                        if (value != null)
                            item[field.name] = JSON.parse(value);
                    });
                });
                resolve(rows);
            });
        });
        let p2 = new Promise((resolve, reject) => {
            let sql = `select count(*) as count from ${tableName} ${sql_filter}`;
            conn.query(sql, args, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].count);
            });
        });
        let r = yield Promise.all([p1, p2]);
        let dataItems = r[0];
        let totalRowCount = r[1];
        return { dataItems, totalRowCount };
    });
}
exports.list = list;
function select(conn, tableName, args) {
    return __awaiter(this, void 0, void 0, function* () {
        args = Object.assign({
            startRowIndex: 0, maximumRows: 100
        }, args || {});
        if (args.filter) {
            let expr = maishu_mysql_helper_1.Parser.parseExpression(args.filter);
            if (expr.type != "Binary") {
                // throw errors.parseFilterFail(args.filter)
                throw new Error('Parse filter fail');
            }
        }
        if (args.sortExpression) {
            let expr = maishu_mysql_helper_1.Parser.parseOrderExpression(args.sortExpression);
            if (expr.type != "Order") {
                // throw errors.parseSortFail(args.sortExpression)
                throw new Error('Parse sort fail');
            }
        }
        return new Promise((resolve, reject) => {
            let sql = `select * from ${tableName}`;
            if (args.filter) {
                sql = sql + ` where ${args.filter}`;
            }
            if (args.sortExpression) {
                sql = sql + ` order by ${args.sortExpression}`;
            }
            sql = sql + ` limit ${args.maximumRows} offset ${args.startRowIndex}`;
            conn.query(sql, args, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                fields.forEach(field => {
                    if (field.type != 245 /* JSON */)
                        return;
                    rows.forEach(item => {
                        let value = item[field.name];
                        if (value != null)
                            item[field.name] = JSON.parse(value);
                    });
                });
                resolve(rows);
            });
        });
    });
}
exports.select = select;
function update(conn, tableName, item) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.errors.argumentNull('tableName');
        if (!item)
            throw errors_1.errors.argumentNull('item');
        if (!item.id)
            throw errors_1.errors.argumentNull('item.id');
        let names = Object.getOwnPropertyNames(item);
        if (names.length == 0) {
            return Promise.resolve();
        }
        let values = [];
        let sql = `update ${tableName} set ? where id = ?`;
        for (let i = 0; i < names.length; i++) {
            if (item[names[i]] != null && typeof item[names[i]] == 'object' && !(item[names[i]] instanceof Date)) {
                item[names[i]] = JSON.stringify(item[names[i]]);
            }
        }
        values.push(item, item.id);
        if (item['create_date_time'])
            delete item['create_date_time'];
        delete item.id;
        return query(conn, sql, values);
    });
}
exports.update = update;
function executeSQL(conn, sql, values) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            conn.query(sql, values, (error, result, fields) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    });
}
exports.executeSQL = executeSQL;
function query(conn, options, values) {
    return new Promise((resolve, reject) => {
        conn.query(options, values, (error, result, fields) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
function get(conn, tableName, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.errors.argumentNull('tableName');
        if (!filter)
            throw errors_1.errors.argumentNull('id');
        let text_filter = '';
        let names = Object.getOwnPropertyNames(filter);
        let values = [];
        for (let i = 0; i < names.length; i++) {
            if (i == 0)
                text_filter = `${names[i]} = ?`;
            else
                text_filter = `${text_filter} and ${names[i]} = ?`;
            values.push(filter[names[i]]);
        }
        let sql = `select * from ${tableName} where ${text_filter} limit 1`;
        return new Promise((resolve, reject) => {
            conn.query(sql, values, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                fields.forEach(field => {
                    if (field.type != 245 /* JSON */)
                        return;
                    rows.forEach(item => {
                        let value = item[field.name];
                        if (value != null)
                            item[field.name] = JSON.parse(value);
                    });
                });
                resolve(rows[0]);
            });
        });
    });
}
exports.get = get;
function insert(conn, tableName, item) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.errors.argumentNull('tableName');
        if (!item)
            throw errors_1.errors.argumentNull('item');
        if (!item.id)
            item.id = guid();
        item['create_date_time'] = new Date(Date.now());
        let names = Object.getOwnPropertyNames(item);
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            let value = item[name];
            if (typeof value == "object" && !(value instanceof Date)) {
                item[name] = JSON.stringify(value);
            }
        }
        let sql = `insert into ${tableName} set ?`;
        return query(conn, sql, item).then(() => {
            return {
                id: item.id,
                create_date_teim: item['create_date_time']
            };
        });
    });
}
exports.insert = insert;
//# sourceMappingURL=database.js.map
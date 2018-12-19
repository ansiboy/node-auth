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
const database_1 = require("../database");
const errors_1 = require("../errors");
function add({ name, path, parent_id, sort_number, type }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name)
            throw errors_1.errors.argumentNull('name');
        if (sort_number != null && typeof sort_number != 'number')
            throw errors_1.errors.argumentTypeIncorrect('sort_number', 'number');
        let item = {
            id: database_1.guid(), name, path,
            parent_id, sort_number, create_date_time: new Date(Date.now()),
            type
        };
        yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            if (item.sort_number == null) {
                let s = `select max(sort_number) as value from resource`;
                let rows;
                if (type == null) {
                    s = s + ` where type is null`;
                    [rows] = yield database_1.execute(conn, s);
                }
                else {
                    s = s + ` where type = ?`;
                    [rows] = yield database_1.execute(conn, s, type);
                }
                console.log(rows);
                let max_sort_number = rows.length == 0 ? 0 : rows[0].value;
                item.sort_number = max_sort_number + 10;
            }
            let sql = `insert into resource set ?`;
            return database_1.execute(conn, sql, item);
        }));
        return { id: item.id };
    });
}
exports.add = add;
function update({ id, name, path, parent_id, sort_number, type }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw errors_1.errors.argumentNull('id');
        if (!name)
            throw errors_1.errors.argumentNull('name');
        let item = {
            name, path,
            parent_id, sort_number, create_date_time: new Date(Date.now()),
            type
        };
        yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `update resource set ? where id = ?`;
            return database_1.execute(conn, sql, [item, id]);
        }));
        return { id: item.id };
    });
}
exports.update = update;
function remove({ id }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw errors_1.errors.argumentNull('id');
        let sql = `delete from resource where id = ?`;
        yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            return database_1.execute(conn, sql, id);
        }));
    });
}
exports.remove = remove;
function list({ type }) {
    return __awaiter(this, void 0, void 0, function* () {
        let [rows] = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `select * from resource`;
            if (type) {
                sql = sql + ` where type = ?`;
            }
            sql = sql + ' order by sort_number';
            return database_1.execute(conn, sql, type);
        }));
        return rows;
    });
}
exports.list = list;
//# sourceMappingURL=resource.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const db = require("maishu-mysql-helper");
const controller_1 = require("../controller");
class ResourceController {
    add({ name, path, parent_id, sort_number, type }) {
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
    update({ item, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.argumentNull('item');
            if (!item.id)
                throw errors_1.errors.fieldNull('id', 'item');
            if (!item.name)
                throw errors_1.errors.fieldNull('name', 'item');
            // delete item.create_date_time
            // item.data = JSON.stringify(item.data || {}) as any
            // await connect(async conn => {
            //     let sql = `update resource set ? where id = ?`
            //     return execute(conn, sql, [item, item.id])
            // })
            yield db.update(conn, 'resource', item);
            return { id: item.id };
        });
    }
    remove({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            let sql = `delete from resource where id = ?`;
            yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                return database_1.execute(conn, sql, id);
            }));
        });
    }
    list({ args, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            if (!args.sortExpression) {
                args.sortExpression = 'sort_number asc';
            }
            let result = yield db.list(conn, 'resource', args);
            return result;
        });
    }
    temp() {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield db.getConnection();
            let resources = yield db.list(conn, 'resource');
            return resources;
        });
    }
}
__decorate([
    controller_1.action()
], ResourceController.prototype, "update", null);
__decorate([
    controller_1.action()
], ResourceController.prototype, "list", null);
exports.default = ResourceController;
//# sourceMappingURL=resource.js.map
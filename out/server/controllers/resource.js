"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const controller_1 = require("../controller");
const maishu_node_mvc_1 = require("maishu-node-mvc");
const mysql = require("mysql");
let ResourceController = class ResourceController {
    add(conn, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item.name)
                throw errors_1.errors.fieldNull('name', 'item');
            item.id = database_1.guid();
            item.create_date_time = new Date(Date.now());
            if (item.sort_number == null) {
                let s = `select max(sort_number) as value from resource`;
                let rows;
                if (item.type == null) {
                    s = s + ` where type is null`;
                    [rows] = yield database_1.execute(conn, s);
                }
                else {
                    s = s + ` where type = ?`;
                    [rows] = yield database_1.execute(conn, s, item.type);
                }
                console.log(rows);
                let max_sort_number = rows.length == 0 ? 0 : rows[0].value;
                item.sort_number = max_sort_number + 10;
            }
            if (item.data && typeof item.data == 'object')
                item.data = JSON.stringify(item.data);
            let sql = `insert into resource set ?`;
            yield database_1.execute(conn, sql, item);
            return { id: item.id };
        });
    }
    update(conn, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.argumentNull('item');
            if (!item.id)
                throw errors_1.errors.fieldNull('id', 'item');
            yield database_1.update(conn, 'resource', item);
            return { id: item.id };
        });
    }
    remove(conn, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            let sql = `delete from resource where id = ?`;
            yield database_1.execute(conn, sql, id);
        });
    }
    list(conn, { args }) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            if (!args.sortExpression) {
                args.sortExpression = 'sort_number asc';
            }
            let result = yield database_1.list(conn, 'resource', args);
            return result;
        });
    }
};
__decorate([
    controller_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "add", null);
__decorate([
    controller_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "update", null);
__decorate([
    controller_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "remove", null);
__decorate([
    controller_1.action(),
    __param(0, database_1.connection),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "list", null);
ResourceController = __decorate([
    maishu_node_mvc_1.controller("resource")
], ResourceController);
exports.default = ResourceController;
//# sourceMappingURL=resource.js.map
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
const maishu_node_mvc_1 = require("maishu-node-mvc");
const mysql = require("mysql");
const entities_1 = require("../entities");
const dataContext_1 = require("../dataContext");
const common_1 = require("../common");
const decorators_1 = require("../decorators");
let ResourceController = class ResourceController {
    add(dc, user, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item.name)
                throw errors_1.errors.fieldNull('name', 'item');
            item.id = database_1.guid();
            item.create_date_time = new Date(Date.now());
            if (item.sort_number == null) {
                let r = yield dc.resources.createQueryBuilder()
                    .select("max(sort_number) as max_sort_number").getRawOne();
                item.sort_number = (r["max_sort_number"] || 0) + 100;
            }
            yield dc.resources.save(item);
            yield dc.roleResources.save({ role_id: user.role_id, resource_id: item.id });
            return { id: item.id, create_date_time: item.create_date_time, sort_number: item.sort_number };
        });
    }
    update(dc, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.argumentNull('item');
            if (!item.id)
                throw errors_1.errors.fieldNull('id', 'item');
            // create_date_time type 不能更新
            delete item.create_date_time;
            delete item.type;
            yield dc.resources.save(item);
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
    list(dc, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                throw errors_1.errors.argumentNull("user");
            if (!user.role_id)
                return [];
            let roleResources = yield dc.roleResources.find({ role_id: user.role_id });
            if (roleResources.length == 0) {
                return [];
            }
            let resourceIds = roleResources.map(o => o.resource_id);
            let resources = yield dc.resources.findByIds(resourceIds, { order: { sort_number: "ASC" } });
            return resources;
        });
    }
    item(dc, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.fieldNull("id", "formData");
            let item = yield dc.resources.findOne(id);
            return item;
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.resource.add),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.currentUser), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, entities_1.User, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "add", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.resource.update),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "update", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.resource.remove),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "remove", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.resource.list),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.currentUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, entities_1.User]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "list", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.resource.item),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], ResourceController.prototype, "item", null);
ResourceController = __decorate([
    maishu_node_mvc_1.controller("resource")
], ResourceController);
exports.default = ResourceController;
//# sourceMappingURL=resource.js.map
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
// import { Connection, list, get, execute as executeSQL } from "maishu-mysql-helper";
const maishu_node_mvc_1 = require("maishu-node-mvc");
const mysql = require("mysql");
const decorators_1 = require("../decorators");
const entities_1 = require("../entities");
const dataContext_1 = require("../dataContext");
const common_1 = require("../common");
// type RoleResource = {
//     id: string,
//     resource_id: string,
//     role_id: string,
//     create_date_time: Date,
//     appliation_id: string,
// }
let RoleController = class RoleController {
    add(dc, userId, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.argumentNull('item');
            if (!item.name)
                throw errors_1.errors.fieldNull("name", "item");
            if (!userId)
                throw errors_1.errors.argumentNull("userId");
            let user = yield dc.users.findOne(userId);
            if (!user)
                throw errors_1.errors.objectNotExistWithId(userId, "User");
            let role = {
                id: database_1.guid(), name: item.name, remark: item.remark,
                create_date_time: new Date(Date.now()),
                parent_id: user.role_id,
            };
            yield dc.roles.save(role);
            return { id: role.id, create_date_time: role.create_date_time };
        });
    }
    update(dc, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.fieldNull("item", "formData");
            if (!item.id)
                throw errors_1.errors.fieldNull("id", "item");
            let role = yield dc.roles.findOne({ id: item.id });
            if (!role)
                throw errors_1.errors.objectNotExistWithId(item.id, "role");
            role.name = item.name;
            role.remark = item.remark;
            yield dc.roles.save(role);
            return { id: role.id };
        });
    }
    remove(dc, user, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            yield dc.roles.delete({ id: id, parent_id: user.role_id });
            return { id };
        });
    }
    /** 获取角色列表 */
    list(dc, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dc)
                throw errors_1.errors.argumentNull("dc");
            let user = yield dc.users.findOne(userId);
            if (!user)
                throw errors_1.errors.objectNotExistWithId(userId, "User");
            let roles = yield dc.roles.find({
                where: { parent_id: user.role_id },
                order: { create_date_time: "DESC" }
            });
            return roles;
        });
    }
    /** 获取单个角色 */
    get(dc, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            if (!dc)
                throw errors_1.errors.argumentNull('dc');
            let r = yield dc.roles.findOne(id);
            return r;
        });
    }
    /**
     * 设置角色所允许访问的资源
     * @param param0 参数
     * roleId 角色 ID
     * resourceIds 角色所允许访问的资源 ID 数组
     * appId 应用 ID
     */
    setResources(dc, { roleId, resourceIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!roleId)
                throw errors_1.errors.fieldNull("roleId", "formData");
            if (!resourceIds)
                throw errors_1.errors.fieldNull("resourceIds", "formData");
            yield dc.roleResources.delete({ role_id: roleId });
            let roleResources = resourceIds.map(o => ({ role_id: roleId, resource_id: o }));
            yield dc.roleResources.save(roleResources);
            return {};
        });
    }
    /**
     * 获取角色的资源编号
     * @param param0
     * roleId: 角色编号
     */
    resourceIds({ roleId }) {
        if (!roleId)
            throw errors_1.errors.argumentNull('roleId');
        return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `select resource_id from role_resource where role_id = ?`;
            let [rows] = yield database_1.execute(conn, sql, [roleId]);
            return rows.map(o => o.resource_id);
        }));
    }
    /**
     * 获取用户角色编号
     */
    userRoles(conn, { userIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIds == null)
                throw errors_1.errors.argumentNull('userIds');
            if (conn == null)
                throw errors_1.errors.argumentNull('conn');
            let items = {};
            if (userIds.length > 0) {
                let str = userIds.map(o => `"${o}"`).join(',');
                let sql = `select * from user_role left join role on user_role.role_id = role.id where user_role.user_id in (${str})`;
                let rows = yield database_1.executeSQL(conn, sql, null);
                for (let i = 0; i < userIds.length; i++) {
                    items[userIds[i]] = rows.filter(o => o.user_id == userIds[i]);
                }
            }
            return items;
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.add),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.UserId), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, String, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "add", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.update),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.remove),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.currentUser), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, entities_1.User, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "remove", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.list),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.UserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "list", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.item),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "get", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.resource.set),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "setResources", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.role.resource.ids),
    __param(0, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "resourceIds", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "userRoles", null);
RoleController = __decorate([
    maishu_node_mvc_1.controller("role")
], RoleController);
exports.default = RoleController;
//# sourceMappingURL=role.js.map
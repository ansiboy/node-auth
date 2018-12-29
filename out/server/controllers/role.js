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
const controller_1 = require("../controller");
const maishu_mysql_helper_1 = require("maishu-mysql-helper");
class RoleController {
    add({ APP_ID, name, remark }) {
        if (!APP_ID)
            throw errors_1.errors.argumentNull('APP_ID');
        if (!name)
            throw errors_1.errors.argumentNull('name');
        return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `insert into role set ?`;
            let role = {
                id: database_1.guid(), name, remark,
                create_date_time: new Date(Date.now()),
                application_id: APP_ID
            };
            yield database_1.execute(conn, sql, role);
            return role;
        }));
    }
    update({ id, name, remark }) {
        return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `update role set ? where id = ?`;
            let role = { name, remark };
            yield database_1.execute(conn, sql, [role, id]);
            return role;
        }));
    }
    remove({ id, APP_ID }) {
        if (!id)
            throw errors_1.errors.argumentNull('id');
        if (!APP_ID)
            throw errors_1.errors.argumentNull('APP_ID');
        return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `delete from role where id = ? and application_id = ?`;
            yield database_1.execute(conn, sql, [id, APP_ID]);
            return { id };
        }));
    }
    /** 获取角色列表 */
    list({ conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield maishu_mysql_helper_1.list(conn, 'role', { sortExpression: 'create_date_time asc' });
            return result.dataItems;
        });
    }
    /** 获取单个角色 */
    get({ id, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            if (!conn)
                throw errors_1.errors.argumentNull('conn');
            let r = yield maishu_mysql_helper_1.get(conn, 'role', { id });
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
    setResources({ roleId, resourceIds }) {
        return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `select * from role_resource where role_id = ?`;
            let [rows] = yield database_1.execute(conn, sql, roleId);
            let roleResources = rows;
            let existsResourceIds = roleResources.map(o => o.resource_id);
            let removeResourceIds = new Array();
            let addResourceIds = new Array();
            existsResourceIds.forEach(resource_id => {
                if (resourceIds.indexOf(resource_id) < 0) {
                    removeResourceIds.push(resource_id);
                }
            });
            resourceIds.forEach(resourceId => {
                if (existsResourceIds.indexOf(resourceId) < 0)
                    addResourceIds.push(resourceId);
            });
            if (removeResourceIds.length > 0) {
                sql = `delete from role_resource where role_id = ? and (`;
                for (let i = 0; i < removeResourceIds.length; i++) {
                    if (i == 0)
                        sql = sql + `resource_id = ?`;
                    else
                        sql = sql + ` or resource_id = ?`;
                }
                sql = sql + ')';
                yield database_1.execute(conn, sql, [roleId, ...removeResourceIds]);
            }
            if (addResourceIds.length > 0) {
                sql = `insert into role_resource (resource_id, role_id, create_date_time) values `;
                let values = new Array();
                for (let i = 0; i < addResourceIds.length; i++) {
                    if (i == 0) {
                        sql = sql + '(?, ?, ?)';
                    }
                    else {
                        sql = sql + ',(?, ?, ?)';
                    }
                    values.push(...[addResourceIds[i], roleId, new Date(Date.now())]);
                }
                yield database_1.execute(conn, sql, values);
            }
            return {};
        }));
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
}
__decorate([
    controller_1.action()
], RoleController.prototype, "list", null);
__decorate([
    controller_1.action()
], RoleController.prototype, "get", null);
exports.default = RoleController;
//# sourceMappingURL=role.js.map
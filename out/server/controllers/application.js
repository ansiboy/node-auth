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
const errors_1 = require("../errors");
const database_1 = require("../database");
const controller_1 = require("../controller");
const db = require("maishu-mysql-helper");
class ApplicationController {
    /** 添加应用 */
    add({ name, userId, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name)
                throw errors_1.errors.argumentNull('name');
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            let application = {
                id: database_1.guid(),
                name,
                data: data == null ? null : JSON.stringify(data),
                user_id: userId,
                create_date_time: new Date(Date.now())
            };
            yield database_1.connect(conn => {
                let sql = `insert into application set ?`;
                return database_1.execute(conn, sql, application);
            });
            return application;
        });
    }
    /** 添加应用 */
    update({ id, name, userId, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            let obj = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select * from application where id = ? and user_id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [id, userId]);
                let app = rows[0];
                if (app == null)
                    throw errors_1.errors.objectNotExistWithId(id, name);
                let obj = {};
                if (name)
                    obj.name = name;
                if (data)
                    obj.data = JSON.stringify(data);
                sql = `update application set ? where id = ?`;
                database_1.execute(conn, sql, [obj, id]);
                return app;
            }));
            return obj;
        });
    }
    remove({ id, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            return database_1.connect(conn => {
                let sql = `delete from application where id = ? and user_id = ?`;
                return database_1.execute(conn, sql, [id, userId]);
            });
        });
    }
    /** 显示指定用户的 Application */
    list({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            let [rows] = yield database_1.connect(conn => {
                let sql = `select * from application where user_id = ?`;
                return database_1.execute(conn, sql, [userId]);
            });
            return rows;
        });
    }
    /** 显示 ID 为 APP_ID 应用下的用户 */
    users({ args, APP_ID, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!APP_ID)
                throw errors_1.errors.argumentNull('APP_ID');
            if (!conn)
                throw errors_1.errors.argumentNull("conn");
            let source = `(select t1.* from application_user as t0 left join user as t1 on t0.user_id = t1.id
                        where t0.application_id = '${APP_ID}') as t1`;
            let r = yield db.list(conn, source, args);
            if (r.dataItems.length == 0) {
                return r;
            }
            let users = r.dataItems;
            // let sql = `select user_id, role_id from user_role where user_id in (?) `
            let userIds = users.map((o) => `'${o.id}'`).join(',');
            let filter = `user_id in (${userIds})`;
            let rows = yield db.select(conn, 'user_role', { filter, sortExpression: 'user_id' });
            users.forEach(user => {
                // let rows = role_result.dataItems;
                user.role_ids = rows.filter(r => r.user_id == user.id).map(o => o.role_id);
            });
            return r;
        });
    }
    addUser({ appId, mobile, roleIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appId)
                throw errors_1.errors.argumentNull('appId');
            if (!mobile)
                throw errors_1.errors.argumentNull('userId');
            if (roleIds != null && !Array.isArray(roleIds)) {
                throw errors_1.errors.argumentTypeIncorrect('roleIds', 'Array');
            }
            return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id from user where mobile = ?`;
                let [rows] = yield database_1.execute(conn, sql, [mobile]);
                if (rows.length == 0) {
                    return Promise.reject(errors_1.errors.mobileNotExists(mobile));
                }
                let userId = rows[0].id;
                sql = `select user_id from application_user where user_id = ? and application_id = ?`;
                rows = (yield database_1.execute(conn, sql, [userId, appId]))[0];
                if (rows.length > 0) {
                    let err = new Error(`手机号为 ${mobile} 的员工已经存在`);
                    return Promise.reject(err);
                }
                sql = `insert into application_user set ?`;
                let obj = { application_id: appId, user_id: userId };
                yield database_1.execute(conn, sql, obj);
                if (roleIds != null && roleIds.length > 0) {
                    let values = [];
                    sql = `insert into user_role (user_id, role_id) values `;
                    for (let i = 0; i < roleIds.length; i++) {
                        sql = sql + "(?, ?)";
                        values.push(userId, roleIds[i]);
                    }
                    yield database_1.execute(conn, sql, values);
                }
                return obj;
            }));
        });
    }
    updateUser({ appId, userId, roleIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appId)
                throw errors_1.errors.argumentNull('appId');
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            if (roleIds != null && !Array.isArray(roleIds)) {
                throw errors_1.errors.argumentTypeIncorrect('roleIds', 'Array');
            }
            return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `delete from user_role where application_id =? and user_id =?`;
                yield database_1.execute(conn, sql, [appId, userId]);
                if (roleIds != null && roleIds.length > 0) {
                    let values = [];
                    sql = `insert into user_role (user_id, role_id, application_id) value `;
                    for (let i = 0; i < roleIds.length; i++) {
                        if (i > 0)
                            sql = sql + ",";
                        sql = sql + "(?, ?, ?)";
                        values.push(userId, roleIds[i], appId);
                    }
                    yield database_1.execute(conn, sql, values);
                }
            }));
        });
    }
    removeUser({ appId, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `delete from application_user where application_id = ? and user_id = ?`;
                yield database_1.execute(conn, sql, [appId, userId]);
            }));
        });
    }
    get({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            let [rows] = yield database_1.connect(conn => {
                let sql = `select * from application where id = ?`;
                return database_1.execute(conn, sql, [id]);
            });
            return rows[0];
        });
    }
}
__decorate([
    controller_1.action()
], ApplicationController.prototype, "users", null);
exports.default = ApplicationController;
//# sourceMappingURL=application.js.map
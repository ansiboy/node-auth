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
const errors_1 = require("../errors");
const database_1 = require("../database");
/** 添加应用 */
function add({ name, userId, data }) {
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
exports.add = add;
/** 添加应用 */
function update({ id, name, userId, data }) {
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
exports.update = update;
function remove({ id, userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw errors_1.errors.argumentNull('id');
        return database_1.connect(conn => {
            let sql = `delete from application where id = ? and user_id = ?`;
            return database_1.execute(conn, sql, [id, userId]);
        });
    });
}
exports.remove = remove;
function list({ userId }) {
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
exports.list = list;
function users({ appId }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!appId)
            throw errors_1.errors.argumentNull('appId');
        let users = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `select t1.* from application_user as t0 left join user as t1 on t0.user_id = t1.id
                   where t0.application_id = ?`;
            let users = (yield database_1.execute(conn, sql, [appId]))[0];
            sql = `select user_id, role_id from user_role where user_id in (?) `;
            let userIds = users.map((o) => o.id);
            let [rows] = yield database_1.execute(conn, sql, [userIds]);
            users.forEach(user => {
                user.role_ids = rows.filter(r => r.user_id == user.id).map(o => o.role_id);
            });
            return users;
        }));
        return users;
    });
}
exports.users = users;
function addUser({ appId, mobile, roleIds }) {
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
            if (roleIds != null) {
                let values = [];
                sql = `insert into user_role (user_id, role_id, application_id) values `;
                for (let i = 0; i < roleIds.length; i++) {
                    sql = sql + "(?, ?)";
                    values.push(userId, roleIds[i], appId);
                }
                yield database_1.execute(conn, sql, values);
            }
            return obj;
        }));
    });
}
exports.addUser = addUser;
function updateUser({ appId, userId, roleIds }) {
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
exports.updateUser = updateUser;
function removeUser({ appId, userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            let sql = `delete from application_user where application_id = ? and user_id = ?`;
            yield database_1.execute(conn, sql, [appId, userId]);
        }));
    });
}
exports.removeUser = removeUser;
function get({ id }) {
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
exports.get = get;
//# sourceMappingURL=application.js.map
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
const token_1 = require("../token");
class UserController {
    //====================================================
    // 商家注册
    /** 手机是否已注册 */
    isMobileRegister({ mobile }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mobile)
                throw errors_1.errors.argumentNull('mobile');
            return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id from user where mobile = ? limit 1`;
                let [rows] = yield database_1.execute(conn, sql, [mobile]);
                return (rows || []).length > 0;
            }));
        });
    }
    register({ mobile, password, smsId, verifyCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (!password)
                throw errors_1.errors.argumentNull('password');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select code from sms_record where id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [smsId]);
                if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                    throw errors_1.errors.verifyCodeIncorrect(verifyCode);
                }
                let user = {
                    id: database_1.guid(), mobile, password,
                    create_date_time: new Date(Date.now()),
                };
                sql = 'insert into user set ?';
                yield database_1.execute(conn, sql, user);
                return user;
            }));
            let token = yield token_1.Token.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    resetPassword({ mobile, password, smsId, verifyCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (!password)
                throw errors_1.errors.argumentNull('password');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
            let result = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select * from user where mobile = ?`;
                let [rows] = yield database_1.execute(conn, sql, [mobile, password]);
                let user = rows == null ? null : rows[0];
                if (user == null) {
                    throw errors_1.errors.mobileNotExists(mobile);
                }
                sql = `update user set password = ? where mobile = ?`;
                yield database_1.execute(conn, sql, [password, mobile]);
                let token = yield token_1.Token.create({ user_id: user.id });
                return { token: token.id, userId: user.id };
            }));
            return result;
        });
    }
    loginByUserName({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username)
                throw errors_1.errors.argumentNull("username");
            if (!password)
                throw errors_1.errors.argumentNull('password');
            //TODO: 检查 username 类型
            let type = 'mobile';
            let [rows] = yield database_1.connect(conn => {
                let sql;
                switch (type) {
                    default:
                    case 'mobile':
                        sql = `select * from user where mobile = ? and password = ?`;
                        break;
                    case 'username':
                        sql = `select * from user where user_name = ? and password = ?`;
                        break;
                    case 'email':
                        sql = `select * from user where email = ? and password = ?`;
                        break;
                }
                return database_1.execute(conn, sql, [username, password]);
            });
            let user = rows == null ? null : rows[0];
            if (user == null) {
                throw errors_1.errors.usernameOrPasswordIncorrect(username);
            }
            let token = yield token_1.Token.create({ user_id: user.id, SellerId: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    loginByOpenId(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { openid } = args;
            if (!openid)
                throw errors_1.errors.argumentNull('openid');
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select * from user where openid = ?`;
                let [rows] = yield database_1.execute(conn, sql, [openid]);
                if (rows.length > 0) {
                    return rows[0];
                }
                let user = {
                    id: database_1.guid(), openid, create_date_time: new Date(Date.now()),
                    data: JSON.stringify(args)
                };
                sql = `insert into user set ?`;
                yield database_1.execute(conn, sql, user);
                return user;
            }));
            let token = yield token_1.Token.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    login(args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            if (args.openid) {
                return this.loginByOpenId(args);
            }
            return this.loginByUserName(args);
        });
    }
    me({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id, user_name, mobile, openid from user where id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [userId]);
                return rows[0];
            }));
            return user;
        });
    }
    getRoles({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let roles = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select r.*
                       from user_role as ur left join role as r on ur.role_id = r.id
                       where ur.user_id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [userId]);
                return rows;
            }));
            return roles;
        });
    }
    setRoles({ userId, roleIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            if (!roleIds)
                throw errors_1.errors.argumentNull('roleIds');
            if (!Array.isArray(roleIds))
                throw errors_1.errors.argumentTypeIncorrect('roleIds', 'array');
            if (roleIds.length == 0) {
                return;
            }
            yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let deleteSQL = `delete from user_role where user_id = ?`;
                database_1.execute(conn, deleteSQL, [userId]);
                let values = [];
                let sql = `insert into user_role (user_id, role_id) values `;
                for (let i = 0; i < roleIds.length; i++) {
                    sql = sql + "(?,?)";
                    values.push(userId, roleIds[i]);
                }
                database_1.execute(conn, sql, values);
            }));
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.js.map
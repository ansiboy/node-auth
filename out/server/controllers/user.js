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
const token_1 = require("../token");
const db = require("maishu-mysql-helper");
const controller_1 = require("../controller");
const role_1 = require("./role");
class UserController {
    //====================================================
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
    isUserNameRegister({ user_name }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_name)
                throw errors_1.errors.argumentNull('user_name');
            return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id from user where user_name = ? limit 1`;
                let [rows] = yield database_1.execute(conn, sql, [user_name]);
                return (rows || []).length > 0;
            }));
        });
    }
    isEmailRegister({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw errors_1.errors.argumentNull('user_name');
            return database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id from user where user_name = ? limit 1`;
                let [rows] = yield database_1.execute(conn, sql, [email]);
                return (rows || []).length > 0;
            }));
        });
    }
    register({ mobile, password, smsId, verifyCode, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (!password)
                throw errors_1.errors.argumentNull('password');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
            data = data || {};
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select code from sms_record where id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [smsId]);
                if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                    throw errors_1.errors.verifyCodeIncorrect(verifyCode);
                }
                let user = {
                    id: database_1.guid(), mobile, password, data: JSON.stringify(data),
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
    resetMobile({ mobile, smsId, verifyCode, USER_ID }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
            let isMobileRegister = yield this.isMobileRegister({ mobile });
            if (isMobileRegister)
                throw errors_1.errors.mobileExists(mobile);
            let result = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select code from sms_record where id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [smsId]);
                if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                    throw errors_1.errors.verifyCodeIncorrect(verifyCode);
                }
                sql = `update user set mobile = ? where id = ?`;
                yield database_1.execute(conn, sql, [mobile, USER_ID]);
                return {};
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
            let usernameRegex = /^[a-zA-Z]+$/;
            let type = usernameRegex.test(username) ? 'username' : 'mobile';
            let [rows] = yield database_1.connect(conn => {
                let sql;
                switch (type) {
                    default:
                    case 'mobile':
                        sql = `select id from user where mobile = ? and password = ?`;
                        break;
                    case 'username':
                        sql = `select id from user where user_name = ? and password = ?`;
                        break;
                    case 'email':
                        sql = `select id from user where email = ? and password = ?`;
                        break;
                }
                return database_1.execute(conn, sql, [username, password]);
            });
            let user = rows == null ? null : rows[0];
            if (user == null) {
                throw errors_1.errors.usernameOrPasswordIncorrect(username);
            }
            let token = yield token_1.Token.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    loginByOpenId(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { openid } = args;
            if (!openid)
                throw errors_1.errors.argumentNull('openid');
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id from user where openid = ?`;
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
    loginByVerifyCode(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mobile, smsId, verifyCode } = args;
            let r = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id form user where mobile = ?`;
                let [rows] = yield database_1.execute(conn, sql, [args.mobile]);
                if (rows.length == 0) {
                    throw errors_1.errors.mobileNotExists(mobile);
                }
                sql = `select code from sms_record where id = ?`;
                [rows] = yield database_1.execute(conn, sql, [smsId]);
                if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                    throw errors_1.errors.verifyCodeIncorrect(verifyCode);
                }
                let user = rows[0];
                let token = yield token_1.Token.create({ user_id: user.id });
                return { token: token.id, userId: user.id };
            }));
            return r;
        });
    }
    login(args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            let p;
            if (args.openid) {
                p = this.loginByOpenId(args);
            }
            else if (args.smsId) {
                p = this.loginByVerifyCode(args);
            }
            else {
                p = this.loginByUserName(args);
            }
            p.then(o => {
                let conn = args.conn;
                console.assert(conn != null);
                // connect(async conn => {
                let now = new Date(Date.now());
                db.update(conn, 'user', { id: o.userId, lastest_login: now });
                return o;
            });
            return p;
        });
    }
    /** 获取登录用户的信息 */
    me({ USER_ID }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.item({ userId: USER_ID });
        });
    }
    /** 获取用户信息 */
    item({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id, user_name, mobile, openid, data from user where id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [userId]);
                return rows[0];
            }));
            return user;
        });
    }
    /**
     * 获取用户角色
     * @param param0
     * 1. userId string
     */
    getRoles({ USER_ID }) {
        return __awaiter(this, void 0, void 0, function* () {
            let roles = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select r.*
                       from user_role as ur left join role as r on ur.role_id = r.id
                       where ur.user_id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [USER_ID]);
                return rows;
            }));
            return roles;
        });
    }
    /**
     * 设置用户权限
     * @param param0
     * 1. userId string, 用设置权限的用户 ID
     * 1. roleIds string[], 角色 ID 数组
     */
    setRoles({ userId, roleIds, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            if (!roleIds)
                throw errors_1.errors.argumentNull('roleIds');
            if (!conn)
                throw errors_1.errors.argumentNull('conn');
            if (!Array.isArray(roleIds))
                throw errors_1.errors.argumentTypeIncorrect('roleIds', 'array');
            yield db.execute(conn, `delete from user_role where user_id = ?`, userId);
            if (roleIds.length > 0) {
                let values = [];
                let sql = `insert into user_role (user_id, role_id) values `;
                for (let i = 0; i < roleIds.length; i++) {
                    sql = sql + "(?,?)";
                    values.push(userId, roleIds[i]);
                }
                yield db.execute(conn, sql, values);
            }
        });
    }
    addRoles({ userId, roleIds, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull("userId");
            if (!roleIds)
                throw errors_1.errors.argumentNull("roleIds");
            if (!conn)
                throw errors_1.errors.argumentNull("conn");
            if (!Array.isArray(roleIds))
                throw errors_1.errors.argumentTypeIncorrect('roleIds', 'array');
            if (roleIds.length == 0)
                return errors_1.errors.argumentEmptyArray("roleIds");
            // await db.execute(conn, `delete from user_role where user_id = ? and role_id in (${roleIds.map(o => '?').join(',')})`, [userId, ...roleIds])
            let roleController = new role_1.default();
            let userRoles = yield roleController.userRoleIds({ userIds: [userId], conn });
            let userRoleIds = userRoles.map(o => o.role_id);
            let values = [];
            let sql = `insert into user_role (user_id, role_id) values `;
            for (let i = 0; i < roleIds.length; i++) {
                if (userRoleIds.indexOf(roleIds[i]) >= 0)
                    continue;
                sql = sql + "(?,?)";
                values.push(userId, roleIds[i]);
            }
            if (values.length > 0)
                yield db.execute(conn, sql, values);
        });
    }
    list({ args, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db.list(conn, 'user', args);
            return result;
        });
    }
    /** 添加用户 */
    add({ item, conn, roleIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = [];
            if (item.mobile) {
                let isMobileRegister = yield this.isMobileRegister({ mobile: item.mobile });
                if (isMobileRegister)
                    return Promise.reject(errors_1.errors.mobileExists(item.mobile));
            }
            if (item.email) {
                let isEmailRegister = yield this.isEmailRegister({ email: item.email });
                if (isEmailRegister)
                    return Promise.reject(errors_1.errors.emailExists(item.email));
            }
            if (item.user_name) {
                let isUserNameRegister = yield this.isUserNameRegister({ user_name: item.user_name });
                if (isUserNameRegister)
                    return Promise.reject(errors_1.errors.usernameExists(item.user_name));
            }
            item.id = database_1.guid();
            item.create_date_time = new Date(Date.now());
            yield db.insert(conn, 'user', item);
            roleIds = roleIds || [];
            for (let i = 0; i < roleIds.length; i++) {
                let userRole = { user_id: item.id, role_id: roleIds[i] };
                yield conn.source.query("insert into user_role set ?", userRole);
            }
            return { id: item.id };
        });
    }
    update({ USER_ID, user, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                throw errors_1.errors.argumentNull('user');
            let u = user;
            u.id = USER_ID;
            let result = yield db.update(conn, 'user', user);
            return result;
        });
    }
    /** 显示用户所拥有的应用 */
    ownAppliactions({ USER_ID, conn }) {
        if (!USER_ID)
            throw errors_1.errors.argumentNull('USER_ID');
        if (!conn)
            throw errors_1.errors.argumentNull('conn');
        return db.list(conn, 'application', { filter: `user_id = '${USER_ID}'` });
    }
    /** 显示用户所允许访问的应用 */
    canVisitApplicationIds({ USER_ID, conn }) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield db.select(conn, 'application_user', { filter: `user_id = '${USER_ID}'` });
            return items.map(o => o.application_id);
        });
    }
}
__decorate([
    controller_1.action()
], UserController.prototype, "login", null);
__decorate([
    controller_1.action()
], UserController.prototype, "setRoles", null);
__decorate([
    controller_1.action()
], UserController.prototype, "addRoles", null);
__decorate([
    controller_1.action()
], UserController.prototype, "list", null);
__decorate([
    controller_1.action()
], UserController.prototype, "add", null);
__decorate([
    controller_1.action()
], UserController.prototype, "update", null);
__decorate([
    controller_1.action()
], UserController.prototype, "ownAppliactions", null);
__decorate([
    controller_1.action()
], UserController.prototype, "canVisitApplicationIds", null);
exports.default = UserController;
//# sourceMappingURL=user.js.map
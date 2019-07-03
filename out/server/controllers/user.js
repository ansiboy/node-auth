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
const token_1 = require("../token");
const db = require("maishu-mysql-helper");
const role_1 = require("./role");
const maishu_node_mvc_1 = require("maishu-node-mvc");
const mysql = require("mysql");
const decorators_1 = require("../decorators");
const dataContext_1 = require("../dataContext");
let UserController = class UserController {
    //====================================================
    /** 手机是否已注册 */
    isMobileRegister(conn, { mobile }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mobile)
                throw errors_1.errors.argumentNull('mobile');
            if (!conn)
                throw errors_1.errors.argumentNull('conn');
            // return connect(async conn => {
            let sql = `select id from user where mobile = ? limit 1`;
            let [rows] = yield database_1.execute(conn, sql, [mobile]);
            return (rows || []).length > 0;
            // })
        });
    }
    isUserNameRegister(conn, { user_name }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_name)
                throw errors_1.errors.argumentNull('user_name');
            if (!conn)
                throw errors_1.errors.argumentNull('conn');
            // return connect(async conn => {
            let sql = `select id from user where user_name = ? limit 1`;
            let [rows] = yield database_1.execute(conn, sql, [user_name]);
            return (rows || []).length > 0;
            // })
        });
    }
    isEmailRegister(conn, { email }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw errors_1.errors.argumentNull('user_name');
            // return connect(async conn => {
            let sql = `select id from user where user_name = ? limit 1`;
            let [rows] = yield database_1.execute(conn, sql, [email]);
            return (rows || []).length > 0;
            // })
        });
    }
    register(conn, { mobile, password, smsId, verifyCode, data }) {
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
            // let user = await connect(async conn => {
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
            // return user
            // })
            let token = yield token_1.Token.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    resetPassword(conn, { mobile, password, smsId, verifyCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (!password)
                throw errors_1.errors.argumentNull('password');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
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
        });
    }
    resetMobile(conn, { mobile, smsId, verifyCode, USER_ID }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
            let isMobileRegister = yield this.isMobileRegister(conn, { mobile });
            if (isMobileRegister)
                throw errors_1.errors.mobileExists(mobile);
            let sql = `select code from sms_record where id = ?`;
            let [rows] = yield database_1.execute(conn, sql, [smsId]);
            if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                throw errors_1.errors.verifyCodeIncorrect(verifyCode);
            }
            sql = `update user set mobile = ? where id = ?`;
            yield database_1.execute(conn, sql, [mobile, USER_ID]);
            return {};
        });
    }
    loginByUserName(conn, { username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username)
                throw errors_1.errors.argumentNull("username");
            if (!password)
                throw errors_1.errors.argumentNull('password');
            //TODO: 检查 username 类型
            let usernameRegex = /^[a-zA-Z\-]+$/;
            let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let type = usernameRegex.test(username) ? 'username' :
                emailRegex.test(username) ? 'email' : 'mobile'; //'mobile'
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
            let [rows] = yield database_1.execute(conn, sql, [username, password]);
            let user = rows == null ? null : rows[0];
            if (user == null) {
                throw errors_1.errors.usernameOrPasswordIncorrect(username);
            }
            let token = yield token_1.Token.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    loginByOpenId(conn, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { openid } = args;
            if (!openid)
                throw errors_1.errors.argumentNull('openid');
            let sql = `select id from user where openid = ?`;
            let [rows] = yield database_1.execute(conn, sql, [openid]);
            let user;
            if (rows.length > 0) {
                user = rows[0];
            }
            else {
                user = {
                    id: database_1.guid(), openid, create_date_time: new Date(Date.now()),
                    data: JSON.stringify(args)
                };
                sql = `insert into user set ?`;
                yield database_1.execute(conn, sql, user);
            }
            let token = yield token_1.Token.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    loginByVerifyCode(conn, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mobile, smsId, verifyCode } = args;
            // let r = await connect(async conn => {
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
            // })
            // return r
        });
    }
    login(dc, conn, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            let p;
            if (args.openid) {
                p = yield this.loginByOpenId(conn, args);
            }
            else if (args.smsId) {
                p = yield this.loginByVerifyCode(conn, args);
            }
            else {
                p = yield this.loginByUserName(conn, args);
            }
            // let o = await p;
            let r = yield dc.userLatestLogins.findOne(p.userId); //.then(r => {
            if (r == null) {
                r = { id: p.userId, latest_login: new Date(Date.now()) };
            }
            else {
                r.latest_login = new Date(Date.now());
            }
            yield dc.userLatestLogins.save(r);
            return p;
        });
    }
    /** 获取登录用户的信息 */
    me(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull('USER_ID');
            return this.item({ userId: userId });
        });
    }
    /** 获取用户信息 */
    item({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull("userId");
            let user = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
                let sql = `select id, user_name, mobile, openid, data from user where id = ?`;
                let [rows] = yield database_1.execute(conn, sql, [userId]);
                return rows[0];
            }));
            return user;
        });
    }
    /**
     * 获取当前登录用户角色
     * @param param0
     * 1. userId string
     */
    getRoles(USER_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!USER_ID)
                throw errors_1.errors.argumentNull('USER_ID');
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
    setRoles(conn, { userId, roleIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull('userId');
            if (!roleIds)
                throw errors_1.errors.argumentNull('roleIds');
            if (!conn)
                throw errors_1.errors.argumentNull('conn');
            if (!Array.isArray(roleIds))
                throw errors_1.errors.argumentTypeIncorrect('roleIds', 'array');
            yield database_1.execute(conn, `delete from user_role where user_id = ?`, userId);
            if (roleIds.length > 0) {
                let values = [];
                let sql = `insert into user_role (user_id, role_id) values `;
                for (let i = 0; i < roleIds.length; i++) {
                    sql = sql + "(?,?)";
                    values.push(userId, roleIds[i]);
                }
                yield database_1.execute(conn, sql, values);
            }
        });
    }
    /**
     * 获取用户角色编号
     */
    userRoleIds(conn, { userIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIds == null)
                throw errors_1.errors.argumentNull('userIds');
            if (conn == null)
                throw errors_1.errors.argumentNull('conn');
            let str = userIds.map(o => `"${o}"`).join(',');
            // let r = await list<UserRole[]>(conn, `user_role`, `user_id in (${str})`)
            let sql = `select * from user_role where user_id in (${str})`;
            let r = yield database_1.executeSQL(conn, sql, null);
            return r;
        });
    }
    addRoles(conn, { userId, roleIds }) {
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
            let roleController = new role_1.default();
            let userRoles = yield this.userRoleIds(conn, { userIds: [userId] });
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
                yield database_1.execute(conn, sql, values);
        });
    }
    list(conn, { args }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield database_1.list(conn, 'user', args);
            return result;
        });
    }
    /** 添加用户 */
    add(conn, { item, roleIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = [];
            if (item.mobile) {
                let isMobileRegister = yield this.isMobileRegister(conn, { mobile: item.mobile });
                if (isMobileRegister)
                    return Promise.reject(errors_1.errors.mobileExists(item.mobile));
            }
            if (item.email) {
                let isEmailRegister = yield this.isEmailRegister(conn, { email: item.email });
                if (isEmailRegister)
                    return Promise.reject(errors_1.errors.emailExists(item.email));
            }
            if (item.user_name) {
                let isUserNameRegister = yield this.isUserNameRegister(conn, { user_name: item.user_name });
                if (isUserNameRegister)
                    return Promise.reject(errors_1.errors.usernameExists(item.user_name));
            }
            item.id = database_1.guid();
            item.create_date_time = new Date(Date.now());
            yield database_1.insert(conn, 'user', item);
            roleIds = roleIds || [];
            for (let i = 0; i < roleIds.length; i++) {
                let userRole = { user_id: item.id, role_id: roleIds[i] };
                yield conn.query("insert into user_role set ?", userRole);
            }
            return { id: item.id };
        });
    }
    update(conn, USER_ID, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                throw errors_1.errors.argumentNull('user');
            let u = user;
            u.id = USER_ID;
            let result = yield database_1.update(conn, 'user', user);
            return result;
        });
    }
    /** 显示用户所拥有的应用 */
    ownAppliactions(conn, USER_ID) {
        if (!USER_ID)
            throw errors_1.errors.argumentNull('USER_ID');
        if (!conn)
            throw errors_1.errors.argumentNull('conn');
        return db.list(conn, 'application', { filter: `user_id = '${USER_ID}'` });
    }
    /** 显示用户所允许访问的应用 */
    canVisitApplicationIds(conn, USER_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield database_1.select(conn, 'application_user', { filter: `user_id = '${USER_ID}'` });
            return items.map(o => o.application_id);
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isMobileRegister", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isUserNameRegister", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isEmailRegister", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection),
    __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetMobile", null);
__decorate([
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginByVerifyCode", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, database_1.connection), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, decorators_1.UserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "item", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, decorators_1.UserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRoles", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setRoles", null);
__decorate([
    maishu_node_mvc_1.action("/role/userRoleIds", "role/ids"),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userRoleIds", null);
__decorate([
    maishu_node_mvc_1.action("addRoles", "role/add"),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addRoles", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "add", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, decorators_1.UserId), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    maishu_node_mvc_1.action("ownAppliactions", "applicaion/list"),
    __param(0, database_1.connection), __param(1, decorators_1.UserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "ownAppliactions", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, decorators_1.UserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "canVisitApplicationIds", null);
UserController = __decorate([
    maishu_node_mvc_1.controller('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.js.map
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
const maishu_node_mvc_1 = require("maishu-node-mvc");
const mysql = require("mysql");
const decorators_1 = require("../decorators");
const dataContext_1 = require("../dataContext");
const entities_1 = require("../entities");
const latest_login_1 = require("./latest-login");
const base_controller_1 = require("./base-controller");
const common_1 = require("../common");
let UserController = class UserController {
    //====================================================
    /** 手机是否已注册 */
    isMobileRegister(dc, { mobile }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mobile)
                throw errors_1.errors.argumentNull('mobile');
            if (!dc)
                throw errors_1.errors.argumentNull('dc');
            let user = yield dc.users.findOne({ mobile });
            return user != null;
        });
    }
    isUserNameRegister(dc, { user_name }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_name)
                throw errors_1.errors.argumentNull('user_name');
            if (!dc)
                throw errors_1.errors.argumentNull('dc');
            let user = yield dc.users.findOne({ user_name });
            return user != null;
        });
    }
    isEmailRegister(dc, { email }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw errors_1.errors.argumentNull('user_name');
            if (!dc)
                throw errors_1.errors.argumentNull('dc');
            let user = yield dc.users.findOne({ email });
            return user != null;
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
            let sql = `select code from sms_record where id = ?`;
            let [rows] = yield database_1.execute(conn, sql, [smsId]);
            if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                throw errors_1.errors.verifyCodeIncorrect(verifyCode);
            }
            let user = {
                id: database_1.guid(), mobile, password, data,
                create_date_time: new Date(Date.now()),
            };
            sql = 'insert into user set ?';
            yield database_1.execute(conn, sql, user);
            // return user
            // })
            let token = yield token_1.TokenManager.create({ user_id: user.id });
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
            let token = yield token_1.TokenManager.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    resetMobile(dc, userId, { mobile, smsId, verifyCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mobile == null)
                throw errors_1.errors.argumentNull('mobile');
            if (smsId == null)
                throw errors_1.errors.argumentNull('smsId');
            if (verifyCode == null)
                throw errors_1.errors.argumentNull('verifyCode');
            let isMobileRegister = yield this.isMobileRegister(dc, { mobile });
            if (isMobileRegister)
                throw errors_1.errors.mobileExists(mobile);
            let smsRecord = yield dc.smsRecords.findOne({ id: smsId });
            if (smsRecord == null || smsRecord.code != verifyCode) {
                throw errors_1.errors.verifyCodeIncorrect(verifyCode);
            }
            yield dc.users.update({ id: userId }, { mobile });
            return { id: userId };
        });
    }
    loginByUserName(dc, { username, password }) {
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
            let user;
            switch (type) {
                default:
                case 'mobile':
                    // sql = `select id from user where mobile = ? and password = ?`
                    user = yield dc.users.findOne({ mobile: username, password });
                    break;
                case 'username':
                    // sql = `select id from user where user_name = ? and password = ?`
                    user = yield dc.users.findOne({ user_name: username, password });
                    break;
                case 'email':
                    // sql = `select id from user where email = ? and password = ?`
                    user = yield dc.users.findOne({ email: username, password });
                    break;
            }
            // let [rows] = await execute(conn, sql, [username, password])
            // let user: User = rows == null ? null : rows[0]
            if (user == null) {
                throw errors_1.errors.usernameOrPasswordIncorrect(username);
            }
            let token = yield token_1.TokenManager.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    loginByOpenId(dc, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { openid } = args;
            if (!openid)
                throw errors_1.errors.argumentNull('openid');
            // let sql = `select id from user where openid = ?`
            // let [rows] = await execute(conn, sql, [openid])
            let user = yield dc.users.findOne({ openid: openid });
            // let user: User
            if (user == null) {
                user = {
                    id: database_1.guid(), openid, create_date_time: new Date(Date.now()),
                    data: args
                };
                // sql = `insert into user set ?`
                // await execute(conn, sql, user)
                yield dc.users.save(user);
            }
            let token = yield token_1.TokenManager.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
        });
    }
    loginByVerifyCode(dc, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mobile, smsId, verifyCode } = args;
            // let sql = `select id form user where mobile = ?`
            // let [rows] = await execute(conn, sql, [args.mobile])
            // if (rows.length == 0) {
            //     throw errors.mobileNotExists(mobile)
            // }
            let user = yield dc.users.findOne({ mobile });
            if (user == null)
                throw errors_1.errors.mobileExists(mobile);
            // sql = `select code from sms_record where id = ?`;
            // [rows] = await execute(conn, sql, [smsId])
            // if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
            //     throw errors.verifyCodeIncorrect(verifyCode)
            // }
            let smsRecord = yield dc.smsRecords.findOne(smsId);
            if (smsRecord == null || smsRecord.code != verifyCode)
                throw errors_1.errors.verifyCodeIncorrect(verifyCode);
            // let user = rows[0]
            let token = yield token_1.TokenManager.create({ user_id: user.id });
            return { token: token.id, userId: user.id };
            // })
            // return r
        });
    }
    login(dc, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            let p;
            if (args.openid) {
                p = yield this.loginByOpenId(dc, args);
            }
            else if (args.smsId) {
                p = yield this.loginByVerifyCode(dc, args);
            }
            else {
                p = yield this.loginByUserName(dc, args);
            }
            let r = yield dc.userLatestLogins.findOne(p.userId); //.then(r => {
            if (r == null) {
                r = { id: p.userId, latest_login: new Date(Date.now()), create_date_time: new Date(Date.now()) };
            }
            else {
                r.latest_login = new Date(Date.now());
            }
            yield dc.userLatestLogins.save(r);
            return p;
        });
    }
    logout(dc, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield token_1.TokenManager.remove(tokenId);
            return {};
        });
    }
    /** 获取登录用户的信息 */
    me(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return user;
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
    userRoleIds(dc, { userIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIds == null)
                throw errors_1.errors.argumentNull('userIds');
            if (dc == null)
                throw errors_1.errors.argumentNull('conn');
            if (!userIds)
                throw errors_1.errors.argumentNull("userIds");
            let users = yield dc.users.findByIds(userIds);
            let result = users.map(o => ({ user_id: o.id, role_id: o.role_id }));
            return result;
        });
    }
    // @action("addRoles", "role/add")
    // async addRoles(@connection conn: mysql.Connection, @formData { userId, roleIds }) {
    //     if (!userId) throw errors.argumentNull("userId")
    //     if (!roleIds) throw errors.argumentNull("roleIds")
    //     if (!conn) throw errors.argumentNull("conn")
    //     if (!Array.isArray(roleIds)) throw errors.argumentTypeIncorrect('roleIds', 'array')
    //     if (roleIds.length == 0)
    //         return errors.argumentEmptyArray("roleIds")
    //     let roleController = new RoleController()
    //     let userRoles = await this.userRoleIds(conn, { userIds: [userId] })
    //     let userRoleIds = userRoles.map(o => o.role_id)
    //     let values = []
    //     let sql = `insert into user_role (user_id, role_id) values `
    //     for (let i = 0; i < roleIds.length; i++) {
    //         if (userRoleIds.indexOf(roleIds[i]) >= 0)
    //             continue
    //         sql = sql + "(?,?)"
    //         values.push(userId, roleIds[i])
    //     }
    //     if (values.length > 0)
    //         await execute(conn, sql, values)
    // }
    list(dc, { args }) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            if (args.filter) {
                args.filter = args.filter + " and (User.is_system is null or User.is_system = false)";
            }
            else {
                args.filter = "(User.is_system is null or User.is_system = false)";
            }
            let result = yield base_controller_1.BaseController.list(dc.users, args, ["role"]);
            if (result.dataItems.length > 0) {
                let userIds = result.dataItems.map(o => o.id);
                let ctrl = new latest_login_1.default();
                let latestLogins = yield ctrl.list(dc, { userIds });
                result.dataItems.forEach(user => {
                    user["lastest_login"] = latestLogins.filter(login => login.id == user.id)
                        .map(o => o.latest_login)[0];
                });
            }
            return result;
        });
    }
    /** 添加用户 */
    add(dc, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (roleIds && !Array.isArray(roleIds))
            //     throw errors.argumentTypeIncorrect("roleId", "Array");
            let p = [];
            if (item.mobile) {
                let isMobileRegister = yield this.isMobileRegister(dc, { mobile: item.mobile });
                if (isMobileRegister)
                    return Promise.reject(errors_1.errors.mobileExists(item.mobile));
            }
            if (item.email) {
                let isEmailRegister = yield this.isEmailRegister(dc, { email: item.email });
                if (isEmailRegister)
                    return Promise.reject(errors_1.errors.emailExists(item.email));
            }
            if (item.user_name) {
                let isUserNameRegister = yield this.isUserNameRegister(dc, { user_name: item.user_name });
                if (isUserNameRegister)
                    return Promise.reject(errors_1.errors.usernameExists(item.user_name));
            }
            item.id = database_1.guid();
            item.create_date_time = new Date(Date.now());
            yield dc.users.save(item);
            if (item.role_id) {
                item.role = yield dc.roles.findOne(item.role_id); //roleIds.map(o => ({ id: o }) as Role)
            }
            return { id: item.id, role: item.role, create_date_time: item.create_date_time };
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
    UserLatestLogin(dc, { userIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield dc.userLatestLogins.createQueryBuilder()
                .where(" id in (...:userIds)")
                .setParameter("userIds", userIds)
                .getMany();
            return items;
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isMobileRegister", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isUserNameRegister", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isEmailRegister", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.register),
    __param(0, database_1.connection),
    __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.resetPassword),
    __param(0, database_1.connection), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.UserId), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetMobile", null);
__decorate([
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginByVerifyCode", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.login),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.logout),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.currentTokenId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.me),
    __param(0, decorators_1.currentUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
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
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userRoleIds", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.list),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.add),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "add", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.user.update),
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
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UserLatestLogin", null);
UserController = __decorate([
    maishu_node_mvc_1.controller('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.js.map
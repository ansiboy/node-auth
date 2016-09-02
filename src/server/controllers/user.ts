
/// <reference path="./../typings/validator/validator.d.ts"/>
import * as validator from 'validator';
import { Database, User, Token } from './../database';
import { Errors } from './../errors';
import { BaseController } from './baseController'
import * as settings from '../settings';

class UserGroups {
    static normal = 'normal'
}

settings.registerMode = 'username';
export class UserController extends BaseController {
    async  test() {
        let db = await Database.createInstance(this.applicationId);
        await db.users.deleteMany({ username: 'maishu' });
        let user = <User>{
            username: 'maishu',
            password: '1234',
            mobile: '13431426607',
            email: '81232259@qq.com'
        }
        return this.register({user});
    }
    private async createUser(user: User) {
        let appId = this.applicationId;

        let db = await Database.createInstance(appId)
        let u = await db.users.findOne({ username: user.username })
        if (u != null) {
            throw Errors.userExists(user.username);
        }
        return db.users.insert(user);
    }
    private async registerByUserName({user}: { user: User }) {
        if (user.username == null) {
            throw Errors.fieldNull('username', 'User');
        }
        if (user.password == null) {
            throw Errors.fieldNull('password', 'User');
        }

        return this.createUser(user);
    }
    private async registerByMobile({user, smsId, verifyCode}) {
        if (user.mobile == null) {
            throw Errors.fieldNull('username', 'User');
        }
        if (user.password == null) {
            throw Errors.fieldNull('password', 'User');
        }
        if (user.smsId == null) {
            throw Errors.argumentNull('smsId');
        }
        if (user.verifyCode == null) {
            throw Errors.argumentNull('verifyCode');
        }

        return this.createUser(user);
    }
    async register(args: { user: User }) {
        if (settings.registerMode == 'username')
            return this.registerByUserName(args);
        else if (settings.registerMode == 'mobile')
            return this.registerByMobile(<any>args);
        else if (settings.registerMode == 'notAllow')
            throw Errors.notAllowRegister();
        else
            throw Errors.notImplement();
    }
    async login({ username, password }): Promise<{ token: string }> {
        if (username == null) {
            throw Errors.argumentNull('username');
        }
        if (password == null) {
            throw Errors.argumentNull('password');
        }

        let db = await Database.createInstance(this.applicationId);
        let user = await db.users.findOne({ username: username });
        if (user == null) {
            throw Errors.userNotExists(username);
        }
        if (user.password != password) {
            throw Errors.passwordIncorect(username);
        }
        let token = await Token.create(this.applicationId, user.id, 'user');
        return { token: token.value };
    }
    update(args: any) {
        let p = new Promise(() => { });

    }
}




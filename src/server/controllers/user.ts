
/// <reference path="./../typings/validator/validator.d.ts"/>
import * as validator from 'validator';
import { Database, User, Token } from './../database';
import { Errors } from './../errors';
import { BaseController } from './baseController'
import * as settings from '../settings';

class UserGroups {
    static normal = 'normal'
}

type LoginArguments = { username: string, password: string };
export class UserController extends BaseController {
    test() {
        return new Promise(async (reslove, reject) => {
            try {
                let db = await Database.createInstance(this.applicationId);
                await db.users.deleteMany({ username: 'maishu' });
                let user = <User>{
                    username: 'maishu',
                    password: '1234',
                    mobile: '13431426607',
                    email: '81232259@qq.com'
                }
                let result = await this.register(user);
                reslove(result);
                return user;
            }
            catch (exc) {
                reject(exc);
            }
        });
    }
    private createUser(user: User) {
        let appId = this.applicationId;
        return new Promise<Error | { id: string, token: string }>(async (reslove, reject) => {
            try {
                let db = await Database.createInstance(appId)
                let u = await db.users.findOne({ username: user.username })//.then((result) => {
                if (u != null) {
                    reject(Errors.userExists(user.username));
                    return;
                }
                let result = await db.users.insert(user);
                reslove(result);
            }
            catch (exc) {
                reject(exc);
            }
        });
    }
    private registerByUserName(user: User) {
        if (user.username == null) {
            throw Errors.fieldNull('username', 'User');
        }
        if (user.password == null) {
            throw Errors.fieldNull('password', 'User');
        }

        return this.createUser(user);
    }
    private registerByMobile(user: User) {
        if (user.mobile == null) {
            throw Errors.fieldNull('username', 'User');
        }
        if (user.password == null) {
            throw Errors.fieldNull('password', 'User');
        }

        return this.createUser(user);
    }
    register(user: User): Promise<Error | any> {
        if (settings.registerMode == 'username')
            return this.registerByUserName(user);
        else if (settings.registerMode == 'mobile')
            return this.registerByMobile(user);
        else if (settings.registerMode == 'notAllow')
            return Promise.reject(Errors.notAllowRegister());
        else
            return Promise.reject(Errors.notImplement());
    }
    async login({ username, password }: LoginArguments): Promise<{ token: string }> {
        if (username == null) {
            throw Errors.argumentNull('username');
        }
        if (password == null) {
            throw Errors.argumentNull('password');;
        }

        // return new Promise<Error | { token: string }>(async (reslove, reject) => {
        //     try {
        let db = await Database.createInstance(this.applicationId);
        let user = await db.users.findOne({ username: username });
        if (user == null) {
            //reject(Errors.userNotExists(username));
            throw Errors.userNotExists(username);
        }
        if (user.password != password) {
            //reject(Errors.passwordIncorect(username));
            throw Errors.passwordIncorect(username);
        }
        let token = await Token.create(this.applicationId, user.id, 'user');
        return { token: token.value };
        //reslove({ token: token.value });
        //     }
        //     catch (exc) {
        //         reject(exc);
        //     }
        // });
    }
    update(args: any) {
        let p = new Promise(() => { });

    }
}




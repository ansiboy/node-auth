
/// <reference path="./../typings/validator/validator.d.ts"/>
import * as validator from 'validator';
import * as data from './../database';
import { Errors } from './../errors';
import { BaseController } from './baseController'
import * as settings from '../settings';

class UserGroups {
    static normal = 'normal'
}

type LoginArguments = { username: string, password: string };
export class UserController extends BaseController {
    test() {
        let user = { name: 'maishu', gender: 'male' };
        return user;
    }
    error() {
        throw new Error('Error');
    }
    private createUser(user: data.User) {
        let appId = this.applicationId;
        return new Promise<Error | { id: string, token: string }>(async (reslove, reject) => {
            try {
                let db = await data.Database.createInstance(appId)
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
    private registerByUserName(user: data.User) {
        if (user.username == null) {
            throw Errors.fieldNull('username', 'User');
        }
        if (user.password == null) {
            throw Errors.fieldNull('password', 'User');
        }

        return this.createUser(user);
    }
    private registerByMobile(user: data.User) {
        if (user.mobile == null) {
            throw Errors.fieldNull('username', 'User');
        }
        if (user.password == null) {
            throw Errors.fieldNull('password', 'User');
        }

        return this.createUser(user);
    }
    register(user: data.User): Promise<Error | any> {
        if (settings.registerMode == 'username')
            return this.registerByUserName(user);
        else if (settings.registerMode == 'mobile')
            return this.registerByMobile(user);
        else if (settings.registerMode == 'notAllow')
            return Promise.reject(Errors.notAllowRegister());
        else
            return Promise.reject(Errors.notImplement());
    }
    login({ username, password }: LoginArguments): Promise<Error | { token: string }> {
        if (validator.isNull(username)) {
            throw Errors.argumentNull('username');
        }
        if (validator.isNull(password)) {
            throw Errors.argumentNull('password');
        }

        return new Promise<Error | { token: string }>(async (reslove, reject) => {
            try {
                let db = await data.Database.createInstance(this.applicationId);
                let user = await db.users.findOne({ username: username });
                if (user == null) {
                    reject(Errors.userNotExists(username));
                    return;
                }
                if (user.password != password) {
                    reject(Errors.passwordIncorect(username));
                    return;
                }
                reslove({ token: data.Token.create(user.id, 'user') });
            }
            catch (exc) {
                reject(exc);
            }
        });
    }
    update(args: any) {
        let p = new Promise(() => { });

    }
}




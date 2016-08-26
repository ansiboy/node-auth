
/// <reference path="./../typings/validator/validator.d.ts"/>
import * as validator from 'validator';
import * as data from './../database';
import { Errors } from './../errors';
import { BaseController } from './baseController'
import * as settings from '../settings';

class UserGroups {
    static normal = 'normal'
}

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
        return new Promise<Error | { id: string, token: string }>((reslove, reject) => {
            data.Database.createInstance(appId).then(db => {
                db.users.findOne({ username: user.username }).then((result) => {
                    if (result != null) {
                        reject(Errors.userExists(user.username));
                        return;
                    }
                    db.users.insert(user)
                        .then((r) => reslove(r))
                        .catch((r) => reslove(r));
                });
            });
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
    login(args: { username: string, password: string }): Promise<Error | { token: string }> {
        if (validator.isNull(args.username)) {
            throw Errors.argumentNull('username');
        }
        if (validator.isNull(args.password)) {
            throw Errors.argumentNull('password');
        }

        return new Promise<Error | { token: string }>((reslove, reject) => {
            data.Database.createInstance(this.applicationId)
                .then(db => db.users.findOne({ username: args.username }))
                .then((user) => {
                    if (user.password != args.password) {
                        reject(Errors.passwordIncorect(args.username));
                        return;
                    }
                    reslove({ token: data.Token.create(user.id, 'user') });
                });
        });
    }
    update(args: any) {
        let p = new Promise(() => { });

    }
}




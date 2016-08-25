
/// <reference path="./../typings/validator/validator.d.ts"/>
import * as validator from 'validator';
import * as data from './../database';
import { Errors } from './../errors';
import { BaseController } from './baseController'

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
    register(args: data.User) {
        if (args.username == null) {
            throw Errors.argumentNull('username');
        }
        if (args.password == null) {
            throw Errors.argumentNull('password');
        }

        let appId = this.applicationId;
        return new Promise<Error | { id: string, token: string }>((reslove, reject) => {
            data.Database.createInstance(appId).then(db => {
                let user = <data.User>{
                    username: args.username,
                    password: args.password,
                }

                db.users.findOne({ username: args.username }).then((user) => {
                    if (user != null) {
                        reject(Errors.userExists(args.username));
                        return;
                    }
                    db.users.insert(user)
                        .then((result) => reslove(result))
                        .catch((result) => reslove(result));
                });
            });
        });
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




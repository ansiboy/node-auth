/// <reference path="typings/mongodb/mongodb-1.4.9.d.ts" />
import * as mongodb from 'mongodb';
import * as tokenParser from './tokenParser';
import * as settings from './settings';
import { Errors } from './Errors';

let MongoClient = mongodb.MongoClient;

export class Table<T extends Entity>{
    private source: mongodb.Collection;
    constructor(db: mongodb.Db, name: string) {
        this.source = db.collection(name);
    }
    insert(entity: T): Promise<any> {
        return new Promise((reslove, reject) => {
            if (entity.id == null)
                entity.id = guid();

            if (entity.createDateTime == null)
                entity.createDateTime = new Date(Date.now());

            this.source.insert(entity, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                reslove(result);
            });
        });
    }
    update(entity: T) {
        if (entity.id == null) {
            throw Errors.fieldNull('id', 'User');
        }
        this.source.update(`id='${entity.id}'`, entity);
    }
    deleteOne(filter: any) {
        return new Promise((reslove, reject) => {
            return this.source.deleteOne(filter, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                reslove(result);
            });
        });
    }
    deleteMany(filter: any) {
        return new Promise((reslove, reject) => {
            return this.source.deleteMany(filter, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                reslove(result);
            });
        });
    }
    find(selector): Promise<Array<T>> {
        return new Promise((reslove, reject) => {
            this.source.find(selector, (err: Error, result: Array<T>) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                reslove(result);
            });
        });
    }
    findOne(selector): Promise<T> {
        return new Promise((reslove, reject) => {
            this.source.findOne(selector, (err: Error, result: T) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                reslove(result);
            });
        });
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export class Database {
    private source: mongodb.Db;
    private _users: Users;
    //private _mobileBindings: Table<MobileBinding>;

    constructor(source: mongodb.Db) {
        this.source = source;
        this._users = new Users(source);
    }

    static async createInstance(appId: string) {
        return new Promise<Database>((reslove, reject) => {
            let connectionString = `mongodb://${settings.monogoHost}/${appId}`;
            MongoClient.connect(connectionString, (err, db) => {
                if (err != null && reject != null) {
                    reject(err);
                }

                let instance = new Database(db);
                reslove(instance);
            })
        });
    }

    get users(): Users {
        return this._users;
    }

    // get mobileBindings(): Table<MobileBinding> {
    //     return this._mobileBindings;
    // }

    close() {
        this.source.close();
    }
}

export class Users extends Table<User> {
    constructor(db: mongodb.Db) {
        super(db, 'User');
    }
}

export interface Entity {
    id?: string,
    createDateTime?: Date,
}

export interface User extends Entity {
    username: string,
    password: string,
    group?: string,
    mobile?: string,
    email?: string,
}

export interface Appliation extends Entity {
    name: string
}

// interface MobileBinding extends Entity {
//     mobile: string,
//     userId: string
// }

// interface EmailBinding extends Entity {
//     email: string,
//     userId: string
// }


/**
 * 用于解释和生成 token 。
 */
export class Token {
    static create(id: string, type: 'user' | 'app'): string {
        return id;
    }
    static parse(token): { id: string, type } {
        return { id: token, type: 'user' };
    }
}

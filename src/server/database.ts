/// <reference path="typings/mongodb/mongodb-1.4.9.d.ts" />
import * as mongodb from 'mongodb';
import * as settings from './settings';
import * as errors from './errors';

let MongoClient = mongodb.MongoClient;

export class Table<T extends Entity>{
    private source: mongodb.Collection;
    constructor(db: mongodb.Db, name: string) {
        if (!db) throw errors.argumentNull('db');
        if (!name) throw errors.argumentNull('name');

        this.source = db.collection(name);
    }
    insertOne(entity: T): Promise<any> {
        return new Promise((reslove, reject) => {
            if (entity.createDateTime == null)
                entity.createDateTime = new Date(Date.now());

            this.source.insertOne(entity, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                reslove(entity);
            });
        });
    }
    updateOne(entity: T): Promise<Error> {
        return new Promise((reslove, reject) => {
            if (entity == null) {
                reject(errors.argumentNull('entity'));
                return;
            }

            if (entity._id == null) {
                reject(errors.fieldNull('id', 'entity'));
                return;
            }

            this.source.updateOne({ _id: entity._id }, entity, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (result.upsertedCount == 0) {
                    reject(errors.updateResultZero());
                    return;
                }
                reject(errors.success());
                return;
            });
        })
    }
    deleteOne(filter: any): Promise<Error> {
        return new Promise((reslove, reject) => {
            return this.source.deleteOne(filter, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                if (result.deletedCount == 0) {
                    reject(errors.deleteResultZero());
                    return;
                }
                reslove(errors.success());
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
            this.source.find(selector, (err: Error, result: mongodb.Cursor) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                result.toArray((err, items: Array<T>) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    reslove(items);
                });
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
    private _tokens: Table<Token>;
    private _applications: Table<Appliation>;

    constructor(source: mongodb.Db) {
        this.source = source;
        this._users = new Users(source);
        this._tokens = new Table<Token>(source, 'Token');
        this._applications = new Table<Appliation>(source, 'Appliation');
    }

    static async createInstance(appId: string) {
        return new Promise<Database>((reslove, reject) => {
            let connectionString = `mongodb://${settings.monogoHost}/${appId}`;
            MongoClient.connect(connectionString, (err, db) => {
                if (err != null) {
                    reject(err);
                    return;
                }

                let instance = new Database(db);
                reslove(instance);
            })
        });
    }

    get users(): Users {
        return this._users;
    }

    get applications(): Table<Appliation> {
        return this._applications;
    }

    get tokens(): Table<Token> {
        return this._tokens;
    }

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
    _id?: string,
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
export class Token implements Entity {
    value: string;
    objectId: string;
    type: string

    static async create(appId: string, objectId: string, type: 'user' | 'app'): Promise<Token> {
        let token = new Token();
        token.value = guid();
        token.objectId = objectId;
        token.type = type;

        let db = await Database.createInstance(appId);
        await db.tokens.insertOne(token);
        return token;
    }

    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static async parse(appId: string, tokenValue: string): Promise<Error | Token> {
        let db = await Database.createInstance(appId);
        let token = await db.tokens.findOne({ value: tokenValue });
        if (token == null) {
            throw errors.invalidToken(tokenValue);
        }
        return token;
    }
}

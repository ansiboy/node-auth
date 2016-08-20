import * as mongodb from 'mongodb';
import * as tokenParser from './tokenParser';
import * as settings from './settings';
import * as models from './models';
import { Errors } from './Errors';

let MongoClient = mongodb.MongoClient;

export class Table<T extends models.Entity>{
    private source: mongodb.Collection;
    constructor(db: mongodb.Db, name: string) {
        this.source = db.collection(name);
    }
    insert(entity: T) {
        this.source.insert(entity);
    }
    update(entity: T) {
        if (entity.id == null) {
            throw Errors.fieldNull('id', 'User');
        }
        this.source.update(`id='${entity.id}'`, entity);
    }
    delete(id: string) {
        if (id == null) {
            throw Errors.argumentNull('id');
        }
        this.source.deleteOne(`id='${id}'`);
    }
    find(filter: string) {
        return this.source.find(filter);
    }
    findOne(selector) {
        this.source.findOne(selector, (err: Error, result) => {

        });
    }
}

export class Database {
    private source: mongodb.Db;
    private _users: Users;

    constructor(source: mongodb.Db) {
        this.source = source;
        this._users = new Users(source);
    }

    static async createInstance(appToken: string) {
        let appName = tokenParser.parseAppToken(appToken).appName;
        return new Promise<Database>((reslove, reject) => {
            let connectionString = `mongodb://${settings.monogoHost}/${appName}`;
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

    close() {
        this.source.close();
    }
}

export class Users extends Table<models.User> {
    constructor(db: mongodb.Db) {
        super(db, 'User');
    }
}
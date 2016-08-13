import * as mongodb from 'mongodb';
import * as tokenParser from './tokenParser';
import * as settings from './settings';
import * as models from './models';

let MongoClient = mongodb.MongoClient;

export class Database {
    private appName: string;
    constructor(appToken: string) {
        this.appName = tokenParser.parseAppToken(appToken).appName;
    }

     execute(callback: (db: mongodb.Db) => void) {
        let connectionString = `mongodb://${settings.monogoHost}/${this.appName}`;
        MongoClient.connect(connectionString, (err, db) => {
            callback(db);
            db.close();
        });
    }

}

//export default Database;
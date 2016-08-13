import * as mongodb from 'mongodb';
import { User } from './../models';
import { Database }  from './../database';

class Users {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }
    upate(user: User) {
        this.db.execute((source) => {

        });
    }
    create(user: User) {

    }
    delete(userId: string) {

    }
}

export default Users;
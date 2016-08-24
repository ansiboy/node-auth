import * as mongodb from 'mongodb';
import { Database, Table }  from './../database';
import { Errors } from './../errors';
import { Utility } from './../utility';
import * as http from 'http';
import * as express from 'express';

class UserGroups {
    static normal = 'normal'
}

export class UserController {
    constructor() {

    }
    test() {
        let user = { name: 'maishu', gender: 'male' };
        throw new Error("Error");;
    }
    async register(req: express.Request) {
        req.checkQuery('username', 'username can not empty.').notEmpty();
        req.checkQuery('password', 'password can not empty.').notEmpty();
        // let user = <User>{
        //     username: req.query['username'],
        //     password: req.query['password'],
        //     group: UserGroups.normal
        // }
        let appToken = req.headers['appToken'];
        let db = await Database.createInstance(appToken);
    }
    async login(req: express.Request) {
        req.checkQuery('username', 'username can not empty.').notEmpty();
        req.checkQuery('password', 'password can not empty.').notEmpty();
        let username = req.query['username'];
        let password = req.query['password'];
        let appToken = req.headers['appToken'];
        let db = await Database.createInstance(appToken);
    }
    update(args: any) {

    }
}




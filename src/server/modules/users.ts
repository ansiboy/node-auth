import * as mongodb from 'mongodb';
import { User } from './../models';
import { Database, Table }  from './../database';
import { Errors } from './../errors';
import { Utility } from './../utility';
import * as http from 'http';
import * as express from 'express';

class UserController {
    constructor() {

    }
    test() {
        let user = { name: 'maishu', gender: 'male' };
        throw new Error("Error");
        //return user;
    }

}

export = UserController;


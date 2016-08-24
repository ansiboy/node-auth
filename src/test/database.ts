import * as assert from 'assert';
import * as data from './../server/database';

describe('Array', async function () {
    let appid = "4C22F420-475F-4085-AA2F-BE5269DE6043";
    let db = await data.Database.createInstance(appid);
    db.users.insert({ username: 'maishu', password: '1234' });
})
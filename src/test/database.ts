import * as assert from 'assert';
import * as data from './../server/database';

describe('Database', function () {
    describe('insert user', function () {
        let appid = "4C22F420-475F-4085-AA2F-BE5269DE6043";


        it('insert user', (done) => {
            data.Database.createInstance(appid).then((db) => {
                db.users
                    .insert({ username: 'maishu', password: '1234' })
                    .then(() => {
                        done();
                        db.close();
                    })
                    .catch((err) => {
                        done(err);
                        db.close();
                    });
            });
        });

        it('find user', (done) => {
            data.Database.createInstance(appid)
                .then((db) => {
                    db.users
                        .findOne({ username: 'maishu' })
                        .then((result) => {
                            assert.notEqual(result, null, 'result 为空');
                            console.log(result);
                            done();
                            db.close();
                        })
                        .catch((err) => {
                            done(err);
                            db.close();
                        });
                });
        });
    });
})
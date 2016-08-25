import * as assert from 'assert';
import * as data from './../server/database';
import {UserController} from './../server/controllers/user';
import {Errors} from './../server/errors';

let appId = "4C22F420-475F-4085-AA2F-BE5269DE6043";
let user = <data.User>{
    username: 'maishu',
    password: '1234',
    mobile: '13431426607',
    email: '81232259@qq.com'
}
function register() {
    let result = data.Database.createInstance(appId)
        .then((db) => db.users.deleteMany({ username: 'maishu' }))
        .then(() => {
            let userController = new UserController(appId);
            return userController.register(user);
        });

    return result;
}

function login() {
    let controller = new UserController(appId);
    let result = new Promise((reslove, reject) => {
        controller
            .login({
                username: user.username,
                password: user.password
            })
            .then((result) => {
                if ((<Error>result).message) {
                    reject(result);
                    return;
                }
                assert.notEqual((<{ token: string }>result).token, null);
                reslove();
            });
    });
    return result;
}

describe('UserController', function () {
    describe('注册', function () {
        it('注册成功', register);
        it('用户名已存在', (done) => {
            let controller = new UserController(appId);
            controller.register(user)
                .then(() => controller.register(user))
                .catch((err: Error) => {
                    assert.equal(err.name, Errors.names.UserExists);
                    done();
                })
                .then(() => done(new Error('Error')));
        });
        it('手机号码已存在', (done) => done());
    })
    describe('登录', function () {
        it('测试用户不存在', function (done) {
            done();
        });
        it('测试密码错误', function (done) {
            done();
        });
    });
});
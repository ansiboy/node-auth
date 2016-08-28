import * as assert from 'assert';
import {User, Database} from './../server/database';
import {UserController} from './../server/controllers/user';
import {Errors} from './../server/errors';

let appId = "4C22F420-475F-4085-AA2F-BE5269DE6043";
let user = <User>{
    username: 'maishu',
    password: '1234',
    mobile: '13431426607',
    email: '81232259@qq.com'
}

describe('UserController', function () {
    describe('注册', function () {
        it('注册成功', async function () {
            let db = await Database.createInstance(appId);
            await db.users.deleteMany({ username: 'maishu' });

            let controller = new UserController(appId);
            await controller.register(user);
        });
        it('用户名已存在', async () => {
            try {
                let db = await Database.createInstance(appId);
                await db.users.deleteMany({ username: 'maishu' });

                let controller = new UserController(appId);
                await controller.register(user);
                await controller.register(user);
                throw new Error('Error:重复注册用户');
            }
            catch (exc) {
                if ((<Error>exc).name != Errors.names.UserExists) {
                    throw exc;
                }
            }
        });
        it('手机号码已存在', (done) => done());
    })
    describe('登录', function () {
        it('成功登录', async function () {
            let db = await Database.createInstance(appId);
            await db.users.deleteMany({ username: 'maishu' });

            let controller = new UserController(appId);
            await controller.register(user);
            let result = await controller.login({ username: user.username, password: user.password });

            assert.notDeepEqual((<{ token: string }>result).token, null);
        });
        it('登录不存在的用户', async function () {
            try {
                let db = await Database.createInstance(appId);
                await db.users.deleteMany({ username: 'maishu' });

                let controller = new UserController(appId);
                await controller.login(user);
                throw new Error('Error:不存在用户可登录');
            }
            catch (exc) {
                if ((<Error>exc).name != Errors.names.UserNotExists)
                    throw exc;
            }
        });
        it('以错误的密码登录', async function () {
            try {
                let db = await Database.createInstance(appId);
                await db.users.deleteMany({ username: 'maishu' });

                let controller = new UserController(appId);
                await controller.register(user);
                let {username, password} = user;
                let result = await controller.login({ username, password: password + 'bbb' });
                throw new Error('Error:不正确的密码也可以登录');
            }
            catch (exc) {
                if ((<Error>exc).name != Errors.names.PasswordIncorect)
                    throw exc;
            }
        });
    });
});
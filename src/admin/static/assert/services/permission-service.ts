import { Service, LoginInfo } from "./service";
import { errors } from "../errors";
import { User, Resource, Role, Token, Path, LoginResult, ResourcePath } from "entities";
import { events } from "../events";
import md5 = require("js-md5");

export class PermissionService extends Service {

    static baseUrl: string

    protected url(path: string) {
        if (!PermissionService.baseUrl)
            throw errors.serviceUrlCanntNull('permissionService');

        return `${PermissionService.baseUrl}/${path}`;
    }

    role = {
        /**
         * 获取角色列表
         */
        list: () => {
            let url = this.url("role/list")
            return this.get<Role[]>(url);
        },

        /**
         * 获取单个角色
         * @param id 要获取的角色编号
         */
        item: (id: string) => {
            let url = this.url("role/item");
            return this.get<Role>(url, { id });
        },

        /**
         * 添加角色
         * @param name 要添加的角色名称
         * @param remark 要添加的角色备注
         */
        add: (item: Partial<Role>) => {
            let url = this.url("role/add");
            return this.postByJson(url, { item })
        },

        /**
         * 删除角色
         * @param id 要删除的角色编号
         */
        remove: (id: string) => {
            let url = this.url("role/remove");
            return this.postByJson(url, { id });
        },

        update: (item: Partial<Role>) => {
            let url = this.url("role/update");
            return this.postByJson(url, { item });
        },

        resource: {
            /**
             * 获取角色所允许访问的资源 id
             * @param roleId 指定的角色编号
             */
            ids: async (roleId: string) => {
                if (!roleId) throw errors.argumentNull('roleId')

                let url = this.url('role/resource/ids')
                let r = await this.getByJson<string[]>(url, { roleId })
                return r || []
            },

            /**
              * 
              * @param roleId 指定的角色编号
              * @param resourceIds 角色所允许访问的资源编号
              */
            set: async (roleId: string, resourceIds: string[]) => {
                if (!roleId) throw errors.argumentNull('roleId')
                if (!resourceIds) throw errors.argumentNull('resourceIds')

                let url = this.url('role/resource/set')
                return this.postByJson(url, { roleId, resourceIds })
            }
        }
    };

    resource = (() => {

        let allResources: Resource[] = null;
        let listExecuting = false;
        let listPromiseStack: {
            resolve: (value: Resource[]) => void,
            reject: (error: any) => void
        }[] = [];

        function deepClone<T>(obj: T) {
            if (obj == null)
                return null;

            let value = JSON.parse(JSON.stringify(obj));
            value = Service.travelJSON(value);
            return value;
        }

        return {
            list: async (): Promise<Resource[]> => {
                if (allResources == null) {
                    let result = new Promise<Resource[]>((resolve, reject) => {
                        listPromiseStack.push({ resolve, reject });
                    })

                    if (listExecuting)
                        return result;

                    listExecuting = true;
                    let url = this.url("resource/list");
                    try {
                        allResources = await this.get<Resource[]>(url);
                        listPromiseStack.forEach(o => o.resolve(deepClone(allResources)));
                    }
                    catch (err) {
                        listPromiseStack.forEach(o => o.reject(err));
                        throw err;
                    }
                    finally {
                        listExecuting = false;
                    }

                }

                return deepClone(allResources);
            },
            item: async (id: string) => {
                let all = await this.resource.list();
                let item = all.filter(o => o.id == id)[0];
                return deepClone(item);
            },
            remove: (id: string) => {
                let url = this.url("resource/remove");
                return this.post(url, { id }).then(r => {
                    allResources = allResources.filter(o => o.id != id);
                    return r;
                });
            },
            add: (item: Partial<Resource>) => {
                let url = this.url("resource/add");
                return this.postByJson<{ id: string }>(url, { item }).then(o => {
                    item = Object.assign(item, o);
                    allResources.push(item as Resource);
                    return o;
                })
            },
            update: async (item: Partial<Resource>) => {
                let url = this.url("resource/update");
                let r = await this.postByJson<{ id: string }>(url, { item });
                let source = allResources.filter(o => o.id == item.id)[0];
                console.assert(source != null);
                let names = Object.getOwnPropertyNames(source);
                for (let i = 0; i < names.length; i++) {
                    source[names[i]] = r[names[i]] || item[names[i]];
                }
                return r;
            },
            path: {
                set: async (resourceId: string, paths: string[]) => {
                    let url = this.url("resource/path/set");
                    let r = await this.postByJson(url, { resourceId, paths });
                }
            }
        }
    })();

    resourcePaths = {
        list: async () => {
            let url = this.url("resource_path/list");
            return this.get<ResourcePath[]>(url)
        }
    }

    user = {
        list: async (args?: DataSourceSelectArguments) => {
            let url = this.url('user/list');
            let result = await this.getByJson<DataSourceSelectResult<User>>(url, { args });
            if (result == null)
                throw errors.unexpectedNullResult();

            return result;
        },
        update: async (item: Partial<User>) => {
            let url = this.url('user/update');
            if (item.password)
                item.password = md5(item.password);

            let result = await this.postByJson(url, { user: item });
            return result;
        },

        /**
         * 添加用户信息
         * @param item 用户
         */
        add: async (item: Partial<User>, roleIds?: string[]) => {
            let url = this.url('user/add')

            console.assert(item.password != null);
            item.password = md5(item.password);

            let r = await this.postByJson<{ id: string }>(url, { item, roleIds })
            return r
        },

        remove: async (id: string) => {
            let url = this.url('user/remove');
            return this.postByJson(url, { id })
        },

        /**
         * 获取用户个人信息
         */
        me: async () => {
            if (!Service.loginInfo.value) {
                return null
            }
            let url = this.url('user/me')
            let user = await this.getByJson<User>(url)
            return user
        },


        /**
         * 登录
         * @param username 用户名
         * @param password 密码
         */
        login: async (username: string, password: string): Promise<LoginResult> => {
            if (!username) throw errors.argumentNull('username')
            if (!password) throw errors.argumentNull('password')

            password = md5(password);
            let url = this.url('user/login')
            let r = await this.postByJson<LoginInfo | null>(url, { username, password })
            if (r == null)
                throw errors.unexpectedNullResult()

            r.username = username;
            Service.loginInfo.value = r
            Service.setStorageLoginInfo(r)
            events.login.fire(this, r)
            return r
        },

        /**
         * 退出登录
         */
        logout() {
            if (Service.loginInfo.value == null)
                return

            //TODO: 将服务端 token 设置为失效

            events.logout.fire(this, Service.loginInfo.value)
            Service.setStorageLoginInfo(null)
            Service.loginInfo.value = null
        },

        /**
         * 重置密码
         * @param mobile 手机号
         * @param password 新密码
         * @param smsId 短信编号
         * @param verifyCode 验证码
         */
        resetPassword: (mobile: string, password: string, smsId: string, verifyCode: string) => {
            if (!mobile) throw errors.argumentNull('mobile')
            if (!password) throw errors.argumentNull('password')
            if (!smsId) throw errors.argumentNull('smsId')
            if (!verifyCode) throw errors.argumentNull('verifyCode')

            password = md5(password);
            let url = this.url('user/resetPassword')
            return this.postByJson(url, { mobile, password, smsId, verifyCode })
        },

        /**
         * 注册
         * @param mobile 手机号
         * @param password 密码
         * @param smsId 短信编号
         * @param verifyCode 验证码
         */
        register: async (mobile: string, password: string, smsId: string, verifyCode: string, data?: { [key: string]: any }) => {
            if (!mobile) throw errors.argumentNull('mobile')
            if (!password) throw errors.argumentNull('password')
            if (!smsId) throw errors.argumentNull('smsId')
            if (!verifyCode) throw errors.argumentNull('verifyCode')

            let url = this.url('user/register')
            let r = await this.postByJson<LoginInfo>(url, { mobile, password, smsId, verifyCode, data })
            if (r == null)
                throw errors.unexpectedNullResult()

            Service.setStorageLoginInfo(r)
            events.register.fire(this, r)

            return r;
        },

        /**
         * 重置手机号码
         * @param mobile 需要重置的新手机号
         * @param smsId 短信编号
         * @param verifyCode 验证码
         */
        resetMobile: (mobile: string, smsId: string, verifyCode: string) => {
            if (!mobile) throw errors.argumentNull('mobile')
            if (!smsId) throw errors.argumentNull('smsId')
            if (!verifyCode) throw errors.argumentNull('verifyCode')

            let url = this.url('user/resetMobile')
            return this.postByJson(url, { mobile, smsId, verifyCode })
        },

    }

    token = {
        list: async (args: DataSourceSelectArguments) => {
            let url = this.url('token/list');
            let r = this.getByJson<DataSourceSelectResult<Token>>(url, { args });
            return r;
        },
        add: async (item: Partial<Token>) => {
            let url = this.url("token/add");
            let r = await this.postByJson<{ id: String }>(url, { item });
            return r;
        }
    }

    path = {
        list: async (resourceId?: string) => {
            let url = this.url("path/list");
            let r = this.getByJson<Path[]>(url, { resourceId });
            return r;
        },
        add: async (item: Partial<Path>) => {
            let url = this.url("path/add");
            let r = this.postByJson<{ id: string, create_date_time: Date }>(url, { item });
            return r;
        }

    }

    sms = {
        /**
         * 发送重置密码操作验证码
         * @param mobile 接收验证码的手机号
         */
        sendResetVerifyCode: (mobile: string) => {
            if (!mobile) throw errors.argumentNull('mobile')

            let url = this.url('sms/sendVerifyCode')
            return this.postByJson<{ smsId: string }>(url, { mobile, type: 'resetPassword' })
        },


        /** 
         * 发送注册操作验证码
         * @param mobile 接收验证码的手机号
         */
        sendRegisterVerifyCode: (mobile: string) => {
            let url = this.url('sms/sendVerifyCode')
            return this.postByJson<{ smsId: string }>(url, { mobile, type: 'register' })
        }
    }


    // //================================================================
    // // 用户相关




    // /**
    //  * 校验验证码
    //  * @param smsId 验证码信息的 ID 号
    //  * @param verifyCode 验证码
    //  */
    // async checkVerifyCode(smsId: string, verifyCode: string) {
    //     if (!smsId) throw errors.argumentNull('smsId')
    //     if (!verifyCode) throw errors.argumentNull('verifycode')

    //     let url = this.url('sms/checkVerifyCode')
    //     let r = await this.postByJson<boolean>(url, { smsId, verifyCode })
    //     return r
    // }

    // /**
    //  * 发送重置密码操作验证码
    //  * @param mobile 接收验证码的手机号
    //  */
    // sendResetVerifyCode(mobile: string) {
    //     if (!mobile) throw errors.argumentNull('mobile')

    //     let url = this.url('sms/sendVerifyCode')
    //     return this.postByJson<{ smsId: string }>(url, { mobile, type: 'resetPassword' })
    // }









    // /**
    //  * 获取用户
    //  * @param userId 用户编号
    //  */
    // async getUser(userId: string) {
    //     let url = this.url('user/item')
    //     let user = await this.getByJson<User | null>(url, { userId })
    //     return user
    // }

    // /**
    //  * 更新用户信息
    //  * @param item 用户
    //  */
    // updateUser(item: User) {
    //     let url = this.url('user/update')
    //     return this.postByJson(url, { user: item })
    // }

    // /**
    //  * 获取当前登录用户的角色
    //  */
    // async myRoles() {
    //     let url = this.url('user/getRoles')
    //     let roles = await this.getByJson<Role[]>(url)
    //     return roles
    // }

    // /**
    //  * 给指定的用户添加角色
    //  * @param userId 用户编号
    //  * @param roleIds 多个角色编号
    //  */
    // addUserRoles(userId: string, roleIds: string[]) {
    //     let url = this.url('user/addRoles')
    //     return this.postByJson(url, { userId, roleIds })
    // }

    // /**
    //  * 获取用角色
    //  * @param userId 用户编号
    //  */
    // async getUserRoles(userId: string): Promise<Role[]> {
    //     let url = this.url('role/userRoles');
    //     let r = await this.getByJson<{ [userId: string]: Role[] }>(url, { userIds: [userId] });
    //     return r[userId];
    // }
}





interface DataSourceSelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}

interface DataSourceSelectResult<T> {
    totalRowCount: number;
    dataItems: Array<T>;
}


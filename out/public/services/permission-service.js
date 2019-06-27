var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-wuzhui", "../errors", "maishu-services-sdk", "maishu-ui-toolkit"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const errors_1 = require("../errors");
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    const maishu_ui_toolkit_1 = require("maishu-ui-toolkit");
    // let config = app.config;
    let { protocol } = location;
    let menuItems;
    class PermissionService extends maishu_services_sdk_1.PermissionService {
        constructor() {
            super();
            this.roleResourceIds = {};
            // this.error.add((sender, err) => {
            //     ui.alert({ title: '错误', message: err.message })
            // })
        }
        // url(path: string) {
        //     return `${protocol}//${config.authServiceHost}/${path}`
        // }
        // async addResource(item: Partial<Resource>) {
        //     let url = this.url('resource/add')
        //     let result = await this.postByJson<{ id: string }>(url, { item })
        //     Object.assign(item, result)
        //     return result
        // }
        // async updateResource(item: Partial<Resource>) {
        //     let url = this.url('resource/update')
        //     let result = await this.postByJson(url, { item })
        //     Object.assign(item, result)
        //     return result
        // }
        getMenuResource(startRowIndex, maximumRows, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                let args = new maishu_wuzhui_1.DataSourceSelectArguments();
                let menuType = 'menu';
                if (!filter)
                    args.filter = `(type = "${menuType}")`;
                else
                    args.filter = `(${filter}) and (type = "${menuType}")`;
                args.maximumRows = maximumRows;
                args.startRowIndex = startRowIndex;
                return this.resourceList(args);
            });
        }
        resourceList(args) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('resource/list');
                if (!args.sortExpression)
                    args.sortExpression = 'sort_number asc';
                let result = yield this.getByJson(url, { args });
                for (let i = 0; i < result.dataItems.length; i++) {
                    result.dataItems[i].data = result.dataItems[i].data || {};
                }
                return result;
            });
        }
        getResources() {
            return __awaiter(this, void 0, void 0, function* () {
                let args = new maishu_wuzhui_1.DataSourceSelectArguments();
                args.sortExpression = `sort_number asc`;
                let r = yield this.resourceList(args);
                let items = r.dataItems.filter(o => o.type != 'button')
                    .map(o => Object.assign({
                    children: r.dataItems.filter(c => c.parent_id == o.id && c.type == 'button'),
                    selected: false,
                }, o));
                return items;
            });
        }
        // async deleteResource(id: string) {
        //     let url = this.url('resource/remove')
        //     return this.postByJson(url, { id })
        // }
        getResourceChildCommands(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let buttonType = 'button';
                let filter = `parent_id = '${id}' and type = '${buttonType}'`;
                let url = `resource/list`;
                let result = yield this.getByJson(url, { filter });
                return result;
            });
        }
        getRoleResourceIds(roleId) {
            const _super = Object.create(null, {
                getRoleResourceIds: { get: () => super.getRoleResourceIds }
            });
            return __awaiter(this, void 0, void 0, function* () {
                let r = this.roleResourceIds[roleId];
                if (!r) {
                    r = this.roleResourceIds[roleId] = yield _super.getRoleResourceIds.call(this, roleId);
                }
                return r;
            });
        }
        //=============================================================
        // // 角色相关
        // getRoles(): Promise<Role[]> {
        //     let url = this.url('role/list')
        //     return this.getByJson(url)
        // }
        // /** 获取单个角色 */
        // getRole(id: string): Promise<Role> {
        //     let url = this.url('role/get')
        //     return this.getByJson(url, { id })
        // }
        // setRoleResource(roleId: string, resourceIds: string[]) {
        //     if (!roleId) throw errors.argumentNull('roleId')
        //     if (!resourceIds) throw errors.argumentNull('resourceIds')
        //     let url = this.url('role/setResources')
        //     return this.postByJson(url, { roleId, resourceIds })
        // }
        // getRoleResourceIds(roleId: string): Promise<string[]> {
        //     if (!roleId) throw errors.argumentNull('roleId')
        //     let url = this.url('role/resourceIds')
        //     return this.getByJson(url, { roleId })
        // }
        setUserRoles(userId, roleIds) {
            let url = this.url('user/setRoles');
            return this.postByJson(url, { userId, roleIds });
        }
        addUserRoles(userId, roleIds) {
            let url = this.url('user/addRoles');
            return this.postByJson(url, { userId, roleIds });
        }
        getUsersRoles(userIds) {
            let url = this.url('role/userRoles');
            return this.getByJson(url, { userIds });
        }
        getUserRoles(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                let roleses = yield this.getUsersRoles([userId]);
                return roleses[userId];
            });
        }
        // //================================================================
        getUserList(args) {
            const _super = Object.create(null, {
                getUserList: { get: () => super.getUserList }
            });
            return __awaiter(this, void 0, void 0, function* () {
                let r = yield _super.getUserList.call(this, args);
                r.dataItems.forEach(o => o.data = o.data || {});
                return r;
            });
        }
        getUsersByIds(ids) {
            return __awaiter(this, void 0, void 0, function* () {
                if (ids == null)
                    throw errors_1.errors.argumentNull('ids');
                if (ids.length == 0)
                    return [];
                let concatedIds = ids.map(o => `'${o}'`).join(',');
                let url = this.url('user/list');
                let args = {
                    filter: `id in (${concatedIds})`
                };
                let result = yield this.getByJson(url, { args });
                return result.dataItems;
            });
        }
        getUser(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!userId)
                    throw errors_1.errors.argumentNull('userId');
                let args = { filter: `id = "${userId}"` };
                let url = this.url('user/list');
                let result = yield this.getByJson(url, { args });
                for (let i = 0; i < result.dataItems.length; i++) {
                    result.dataItems[i].data = result.dataItems[i].data || {};
                }
                return result.dataItems[0];
            });
        }
        getUserByMobile(mobile) {
            return __awaiter(this, void 0, void 0, function* () {
                let args = new maishu_wuzhui_1.DataSourceSelectArguments();
                args.filter = `mobile = '${mobile}'`;
                let r = yield this.getUserList(args);
                return r.dataItems[0];
            });
        }
        addAdmin(item) {
            return __awaiter(this, void 0, void 0, function* () {
                let admin = yield this.getUserByMobile(item.mobile);
                if (admin != null) {
                    let err = errors_1.errors.userExists(item.mobile);
                    maishu_ui_toolkit_1.alert({ title: '错误', message: err.message });
                    return Promise.reject(err);
                }
                let result;
                // if (admin == null) {
                let url = this.url('user/add');
                let obj = Object.assign({}, item);
                delete obj.role_ids;
                result = yield this.postByJson(url, { item: obj });
                item.id = result.id;
                // }
                // else {
                //     result = { id: admin.id }
                // }
                url = this.url('application/addUser');
                yield this.postByJson(url, { mobile: item.mobile });
                yield this.setUserRoles(item.id, item.role_ids || []);
                return result;
            });
        }
        deleteAdmin(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('application/removeUser');
                return this.deleteByJson(url, { userId });
            });
        }
        updateAdmin(item) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.deleteAdmin(item.id);
                this.addAdmin(item);
            });
        }
        /** 获取菜单列表 */
        getPlatformMenu() {
            return __awaiter(this, void 0, void 0, function* () {
                if (menuItems != null) {
                    return menuItems;
                }
                let buttonType = 'button';
                let args = new maishu_wuzhui_1.DataSourceSelectArguments();
                args.filter = `category = 'platform' or type = '${buttonType}'`;
                let result = this.getMenu(args);
                return result;
            });
        }
        /** 获取菜单列表 */
        getMenu(args) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield this.resourceList(args);
                let resources = result.dataItems;
                // 一级级菜单
                menuItems = resources.filter(o => o.parent_id == null)
                    .map(o => ({
                    id: o.id, name: o.name, visible: o.data.visible == null ? true : o.data.visible,
                    path: this.createPath(o)
                }));
                // 二级菜单
                for (let i = 0; i < menuItems.length; i++) {
                    menuItems[i].children = resources.filter(o => o.parent_id == menuItems[i].id && o.type != 'button')
                        .map(o => ({
                        id: o.id,
                        name: o.name,
                        path: this.createPath(o),
                        parent: menuItems[i],
                        visible: o.data.visible == null ? true : o.data.visible,
                    }));
                }
                let findMenuItem = function (id) {
                    let stack = [...menuItems];
                    while (stack.length > 0) {
                        let item = stack.pop();
                        if (item.id == id) {
                            return item;
                        }
                        let children = item.children || [];
                        stack.push(...children);
                    }
                };
                let commandMenuItems = resources.filter(o => o.type == 'button');
                commandMenuItems.forEach(c => {
                    let parent = findMenuItem(c.parent_id);
                    if (parent) {
                        parent.children = parent.children || [];
                        let obj = Object.assign({ children: [], visible: false }, c);
                        parent.children.push(obj);
                        obj.parent = parent;
                    }
                });
                return menuItems;
            });
        }
        getMenuItem(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let args = new maishu_wuzhui_1.DataSourceSelectArguments();
                args.filter = `id = '${id}' or parent_id = '${id}'`;
                let r = yield this.resourceList(args);
                let dataItem = r.dataItems.filter(o => o.id == id)[0];
                if (!dataItem)
                    return null;
                dataItem.children = r.dataItems.filter(o => o.parent_id == id)
                    .map(o => Object.assign({ children: [], visible: o.data.visible }, o));
                return dataItem;
            });
        }
        createPath(menuItem) {
            if (!menuItem.path)
                return "";
            let o = menuItem;
            let path = `${o.path}?resource_id=${o.id}&object_type=${(o.path || '').split('/')[0]}`;
            return path;
        }
        // async login(username: string, password: string) {
        //     let url = this.url('user/login')
        //     let result = await this.postByJson<LoginResult>(url, { username, password })
        //     Service.token.value = result.token
        // }
        // logout() {
        //     Service.token.value = ''
        // }
        static get isLogin() {
            // return (Service.token.value || '') != ''
            return maishu_services_sdk_1.PermissionService.loginInfo.value != null;
        }
        addUser(item) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('user/add');
                let result;
                let r = yield this.postByJson(url, { item });
                return r;
            });
        }
    }
    exports.PermissionService = PermissionService;
});

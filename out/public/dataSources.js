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
        define(["require", "exports", "maishu-wuzhui", "services/permission-service", "init"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const permission_service_1 = require("services/permission-service");
    const init_1 = require("init");
    let permissionService = init_1.g.app.createService(permission_service_1.PermissionService);
    class MyDataSource extends maishu_wuzhui_1.DataSource {
        constructor(params) {
            super(params);
            if (params.getItem == null) {
                params.getItem = (id) => __awaiter(this, void 0, void 0, function* () {
                    let filter = `id = '${id}'`;
                    let args = new maishu_wuzhui_1.DataSourceSelectArguments();
                    args.filter = filter;
                    let r = yield this.executeSelect(args);
                    return r.dataItems[0];
                });
            }
            this.getItem = params.getItem;
        }
    }
    exports.MyDataSource = MyDataSource;
    function createRoleDataSource() {
        let roleDataSource = new MyDataSource({
            primaryKeys: ['id'],
            select() {
                return __awaiter(this, void 0, void 0, function* () {
                    let roles = yield permissionService.role.list();
                    return { dataItems: roles, totalRowCount: roles.length };
                });
            },
            getItem(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    let role = yield permissionService.role.item(id);
                    return role;
                });
            },
            insert(item) {
                return __awaiter(this, void 0, void 0, function* () {
                    let r = yield permissionService.role.add(item);
                    return r;
                });
            },
            delete(item) {
                return __awaiter(this, void 0, void 0, function* () {
                    let r = yield permissionService.role.remove(item.id);
                    return r;
                });
            }
        });
        return roleDataSource;
    }
    function createMenuDataSource() {
        let menuDataSource = new MyDataSource({
            primaryKeys: ['id'],
            select(args) {
                return __awaiter(this, void 0, void 0, function* () {
                    let r = yield permissionService.menu.list(args);
                    return { dataItems: r, totalRowCount: r.length };
                });
            },
            getItem(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    // let menuItem = await permissionService.getMenuItem(id)
                    // menuItem.originalChildren = Object.assign([], menuItem.children)
                    // return menuItem
                    let r = yield permissionService.resource.item(id);
                    return r;
                });
            },
            delete(item) {
                // return permissionService.deleteResource(item.id)
                return permissionService.resource.remove(item.id);
            },
            insert(item) {
                return __awaiter(this, void 0, void 0, function* () {
                    let obj = JSON.parse(JSON.stringify(item));
                    delete obj.children;
                    delete obj.originalChildren;
                    delete obj.visible;
                    let r = yield permissionService.resource.add(obj);
                    console.assert(r.id != null);
                    Object.assign(item, r);
                    item.children.forEach(child => {
                        child.parent_id = item.id;
                        permissionService.addResource(child);
                    });
                    return r;
                });
            },
            update(item) {
                return __awaiter(this, void 0, void 0, function* () {
                    item.children = item.children || [];
                    item.originalChildren = item.originalChildren || [];
                    // 查找要删除的
                    for (let i = 0; i < item.originalChildren.length; i++) {
                        let child = item.children.filter(o => o.id == item.originalChildren[i].id)[0];
                        if (child == null) {
                            permissionService.deleteResource(item.originalChildren[i].id);
                        }
                    }
                    // 查找要添加的
                    for (let i = 0; i < item.children.length; i++) {
                        let child = item.originalChildren.filter(o => o.id == item.children[i].id)[0];
                        if (child == null) {
                            console.assert(item.children[i].parent_id == item.id);
                            let obj = Object.assign({}, item.children[i]);
                            delete obj.children;
                            delete obj.originalChildren;
                            delete obj.visible;
                            permissionService.addResource(obj);
                        }
                    }
                    item.parent_id = !item.parent_id ? null : item.parent_id;
                    let obj = JSON.parse(JSON.stringify(item));
                    delete obj.children;
                    delete obj.originalChildren;
                    yield permissionService.updateResource(obj);
                    item.children = Object.assign([], item.originalChildren);
                });
            }
        });
        return menuDataSource;
    }
    exports.createMenuDataSource = createMenuDataSource;
    class DataSources {
        constructor() {
            this.role = createRoleDataSource();
            this.menu = createMenuDataSource();
        }
    }
    exports.DataSources = DataSources;
    exports.dataSources = new DataSources();
});

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
        define(["require", "exports", "maishu-wuzhui", "maishu-services-sdk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    // import { Role } from '../../out/server/entities';
    // let adminService = app.createService(AdminService)
    // let messageService = app.createService(MessageService)
    // let permissionService = app.createService(PermissionService)
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
    function createRoleDataSource(app) {
        let permissionService = app.createService(maishu_services_sdk_1.PermissionService);
        let roleDataSource = new MyDataSource({
            primaryKeys: ['id'],
            select() {
                return __awaiter(this, void 0, void 0, function* () {
                    let roles = yield permissionService.getRoles();
                    return { dataItems: roles, totalRowCount: roles.length };
                });
            },
            getItem(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    let role = yield permissionService.getRole(id);
                    return role;
                });
            }
        });
        return roleDataSource;
    }
    exports.createRoleDataSource = createRoleDataSource;
});

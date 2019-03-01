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
        define(["require", "exports", "../config", "./service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const config_1 = require("../config");
    const service_1 = require("./service");
    let { protocol } = location;
    class UserService extends service_1.default {
        url(path) {
            return `${protocol}//${config_1.config.authServiceHost}/${path}`;
        }
        resources() {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('resource/list');
                let args = { filter: `type = "${config_1.config.menuType}"` };
                let result = yield this.getByJson(url, { args });
                let resources = result.dataItems;
                for (let i = 0; i < resources.length; i++) {
                    let data = resources[i].data;
                    if (data) {
                        delete resources[i].data;
                        Object.assign(resources[i], data);
                    }
                }
                return resources;
            });
        }
        login(username, password) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('user/login');
                let result = yield this.postByJson(url, { username, password });
                // UserService.token.value = result.token
                UserService.loginInfo.value = result;
            });
        }
        logout() {
            // UserService.token.value = ''
            UserService.loginInfo.value = null;
        }
        static get isLogin() {
            // return (UserService.token.value || '') != ''
            return UserService.loginInfo.value != null;
        }
    }
    // static token = new chitu.ValueStore(localStorage['adminToken'] || '');
    UserService.loginInfo = new chitu.ValueStore();
    exports.UserService = UserService;
});
// UserService.token.add((value) => {
//     localStorage.setItem("adminToken", value);
// });

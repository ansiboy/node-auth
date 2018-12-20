(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.maishu_node_auth = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-chitu-admin", "maishu-chitu-admin", "maishu-ui-toolkit", "./services/user", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_chitu_admin_1 = require("maishu-chitu-admin");
    var maishu_chitu_admin_2 = require("maishu-chitu-admin");
    exports.app = maishu_chitu_admin_2.app;
    const ui = require("maishu-ui-toolkit");
    const user_1 = require("./services/user");
    const React = require("react");
    maishu_chitu_admin_1.app.error.add((sender, error, page) => {
        ui.alert({ title: '错误', message: error.message });
    });
    let userService = new user_1.UserService();
    userService.resources().then(resources => {
        let menus = resources.filter(o => o.parent_id == null)
            .map(o => ({ id: o.id, name: o.name, path: o.path, visible: o.visible }));
        for (let i = 0; i < menus.length; i++) {
            menus[i].children = resources.filter(o => o.parent_id == menus[i].id)
                .map(o => ({
                id: o.id,
                name: o.name,
                path: o.path,
                parent: menus[i],
                visible: o.visible,
            }));
        }
        maishu_chitu_admin_1.app.masterPage.setMenus(menus);
    });
    class Toolbar extends React.Component {
        constructor(props) {
            super(props);
            this.state = { currentPageName: null };
        }
        componentDidMount() {
            maishu_chitu_admin_1.app.pageShowing.add((sender, page) => {
                this.setState({ currentPageName: page.name });
            });
        }
        render() {
            let showLoginButton = ['forget-password', 'login', 'register'].indexOf(this.state.currentPageName) < 0;
            return React.createElement("ul", null, showLoginButton ? React.createElement("li", { className: "light-blue pull-right", style: { color: 'white', paddingTop: 4, cursor: 'pointer' }, onClick: () => {
                    userService.logout();
                    maishu_chitu_admin_1.app.redirect('login');
                } },
                React.createElement("i", { className: "icon-off" }),
                React.createElement("span", { style: { paddingLeft: 4 } }, "\u9000\u51FA")) : null);
        }
    }
    maishu_chitu_admin_1.app.masterPage.setToolbar(React.createElement(Toolbar, null));
});

},{"./services/user":4,"maishu-chitu-admin":"maishu-chitu-admin","maishu-ui-toolkit":"maishu-ui-toolkit","react":"react"}],2:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-chitu-admin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_chitu_admin_1 = require("maishu-chitu-admin");
    maishu_chitu_admin_1.app.config.login = Object.assign({
        showForgetPassword: true, showRegister: true
    }, maishu_chitu_admin_1.app.config.login || {});
    exports.config = maishu_chitu_admin_1.app.config;
});

},{"maishu-chitu-admin":"maishu-chitu-admin"}],3:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-chitu"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chitu = require("maishu-chitu");
    class Service extends chitu.Service {
        constructor() {
            super();
        }
        ajax(url, options) {
            return super.ajax(url, options).then((data) => {
                if (data != null && data['DataItems'] != null && data['TotalRowCount'] != null) {
                    let d = {};
                    let keys = Object.keys(data);
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        let k = key[0].toLowerCase() + key.substr(1);
                        d[k] = data[key];
                    }
                    data = d;
                }
                this.travelJSON(data);
                return data;
            });
        }
        /**
         * 遍历 JSON 对象各个字段，将日期字符串转换为 Date 对象
         * @param obj 要转换的 JSON 对象
         */
        travelJSON(obj) {
            if (typeof obj === 'string' && this.isDateString(obj)) {
                return new Date(obj);
            }
            else if (typeof obj === 'string') {
                return obj;
            }
            var stack = new Array();
            stack.push(obj);
            while (stack.length > 0) {
                var item = stack.pop();
                for (var key in item) {
                    var value = item[key];
                    if (value == null)
                        continue;
                    if (value instanceof Array) {
                        for (var i = 0; i < value.length; i++) {
                            stack.push(value[i]);
                        }
                        continue;
                    }
                    if (typeof value == 'object') {
                        stack.push(value);
                        continue;
                    }
                    if (typeof value == 'string' && this.isDateString(value)) {
                        item[key] = new Date(value);
                    }
                }
            }
            return obj;
        }
        isDateString(text) {
            const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
            const datePattern1 = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/;
            return text.match(datePattern) != null || text.match(datePattern1) != null;
        }
        getByJson(url, data) {
            if (data && Object.getOwnPropertyNames(data).length > 0)
                url = `${url}?${JSON.stringify(data)}`;
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, method: 'get' });
        }
        putByJson(url, data) {
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, data, method: 'put' });
        }
        postByJson(url, data) {
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, data, method: 'post' });
        }
        deleteByJson(url, data) {
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, data, method: 'delete' });
        }
        get(url, data) {
            data = data || {};
            let params = "";
            for (let key in data) {
                params = params ? `${params}&${key}=${data[key]}` : `${key}=${data[key]}`;
            }
            if (params) {
                url = `${url}?${params}`;
            }
            return this.ajax(url, { method: 'get' });
        }
        put(url, data) {
            let headers = { "content-type": 'application/x-www-form-urlencoded' };
            return this.ajax(url, { headers, data, method: 'put' });
        }
        post(url, data) {
            let headers = { "content-type": 'application/x-www-form-urlencoded' };
            return this.ajax(url, { headers, data, method: 'post', });
        }
        delete(url, data) {
            let headers = { "content-type": 'application/x-www-form-urlencoded' };
            return this.ajax(url, { headers, data, method: 'delete' });
        }
    }
    exports.default = Service;
});

},{"maishu-chitu":"maishu-chitu"}],4:[function(require,module,exports){
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
                UserService.token.value = result.token;
            });
        }
        logout() {
            UserService.token.value = '';
        }
        static get isLogin() {
            return (UserService.token.value || '') != '';
        }
    }
    UserService.token = new chitu.ValueStore(localStorage['adminToken'] || '');
    exports.UserService = UserService;
    UserService.token.add((value) => {
        localStorage.setItem("adminToken", value);
    });
});

},{"../config":2,"./service":3}]},{},[1])(1)
});

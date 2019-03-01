(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('modules/forget-password',["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    class ForgetPassword extends React.Component {
        constructor(props) {
            super(props);
            this.state = { buttonText: '发送验证码', buttonEnable: true };
        }
        render() {
            return (React.createElement("div", { className: "container" },
                React.createElement("div", { ref: o => this.formElement = o, className: "User-Register form-horizontal col-md-6 col-md-offset-3" },
                    React.createElement("h2", null, "\u5FD8\u8BB0\u5BC6\u7801"),
                    React.createElement("hr", null),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u624B\u673A\u53F7\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { name: "mobile", type: "text", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u9A8C\u8BC1\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("input", { name: "verifyCode", className: "form-control" }),
                                React.createElement("span", { className: "input-group-btn" },
                                    React.createElement("button", { onClick: () => this.sendVerifyCode(), className: "btn btn-default", disabled: !this.state.buttonEnable }, this.state.buttonText))),
                            React.createElement("span", { className: "", style: { display: 'none' } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "password", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u786E\u8BA4\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "confirmPassword", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                    if (!e)
                                        return;
                                    // e.onclick = ui.buttonOnClick(() => this.resetPassword())
                                } },
                                React.createElement("i", { className: "icon-key" }),
                                "\u91CD\u7F6E\u5BC6\u7801"))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("div", { className: "pull-left" },
                                React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect("register") }, "\u6CE8\u518C")),
                            React.createElement("div", { className: "pull-right" },
                                React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect("login") }, "\u767B\u5F55")))))));
        }
        sendVerifyCode() {
            throw new Error("Method not implemented.");
        }
    }
    exports.default = ForgetPassword;
});

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('config',["require", "exports", "maishu-chitu-admin"], factory);
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

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('services/service',["require", "exports", "maishu-chitu"], factory);
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
        define('services/user',["require", "exports", "../config", "./service"], factory);
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
        define('modules/login',["require", "exports", "react", "maishu-dilu", "../services/user", "maishu-ui-toolkit", "../config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const maishu_dilu_1 = require("maishu-dilu");
    const user_1 = require("../services/user");
    const ui = require("maishu-ui-toolkit");
    const config_1 = require("../config");
    class LoginPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                buttonText: '发送验证码', buttonEnable: true
            };
        }
        login() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.validator.check()) {
                    return;
                }
                let userService = this.props.app.currentPage.createService(user_1.UserService);
                let { username, password } = this.state;
                yield userService.login(username, password);
                let redirect = this.props.redirect;
                if (redirect) {
                    let r = this.props.app.parseUrl(redirect);
                    this.props.app.redirect(r.pageName, r.values);
                    return;
                }
                let indexPageName = this.props.app.config.login.indexPageName || 'index';
                this.props.app.redirect(indexPageName);
            });
        }
        componentDidMount() {
            this.validator = new maishu_dilu_1.FormValidator(this.element, { name: 'username', rules: [maishu_dilu_1.rules.required('请输入用户名')] }, { name: 'password', rules: [maishu_dilu_1.rules.required('请输入密码')] });
        }
        render() {
            let { username, password } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("h1", { key: 8, className: "text-center", style: { paddingBottom: 50 } }, config_1.config.login.title),
                React.createElement("div", { key: 10, className: "form-horizontal container", style: { maxWidth: 500 }, ref: (e) => this.element = e || this.element },
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u7528\u6237\u540D"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { name: "username", type: "text", className: "form-control", value: username || '', onChange: e => {
                                    this.setState({ username: e.target.value });
                                } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "password", className: "form-control", value: password || '', onChange: e => {
                                    this.setState({ password: e.target.value });
                                } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("button", { type: "button", className: "btn btn-primary btn-block", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = ui.buttonOnClick(() => this.login());
                                } },
                                React.createElement("i", { className: "icon-key" }),
                                "\u7ACB\u5373\u767B\u5F55"))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            config_1.config.login.showForgetPassword ?
                                React.createElement("div", { className: "pull-left" },
                                    React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect("forget-password") }, "\u5FD8\u8BB0\u5BC6\u7801")) : null,
                            config_1.config.login.showRegister ?
                                React.createElement("div", { className: "pull-right" },
                                    React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect("register") }, "\u6CE8\u518C")) : null))));
        }
    }
    exports.default = LoginPage;
});

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('modules/register',["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    class RegisterPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { buttonText: '发送验证码', buttonEnable: true };
        }
        render() {
            return React.createElement("div", { className: "container" },
                React.createElement("div", { ref: o => this.formElement = o, className: "User-Register form-horizontal col-md-6 col-md-offset-3" },
                    React.createElement("h2", null, "\u7ACB\u5373\u6CE8\u518C"),
                    React.createElement("hr", null),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u624B\u673A\u53F7\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { name: "mobile", type: "text", className: "form-control" }),
                            React.createElement("span", { className: "mobile validationMessage", style: { display: 'none' } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u9A8C\u8BC1\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("input", { name: "verifyCode", className: "form-control" }),
                                React.createElement("span", { className: "input-group-btn" },
                                    React.createElement("button", { className: "btn btn-default", disabled: !this.state.buttonEnable }, this.state.buttonText))),
                            React.createElement("span", { className: "", style: { display: 'none' } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "password", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u786E\u8BA4\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "confirmPassword", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                    if (!e)
                                        return;
                                    // e.onclick = ui.buttonOnClick(() => this.register())
                                } },
                                React.createElement("i", { className: "icon-key" }),
                                "\u7ACB\u5373\u6CE8\u518C"))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("div", { className: "pull-left" },
                                React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect('forget-password') }, "\u5FD8\u8BB0\u5BC6\u7801")),
                            React.createElement("div", { className: "pull-right" },
                                React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect("login") }, "\u767B\u5F55"))))));
        }
    }
    exports.default = RegisterPage;
});


(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.maishu_node_auth = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-chitu-admin", "maishu-chitu-admin", "./services/user", "./services/user", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_chitu_admin_1 = require("maishu-chitu-admin");
    var maishu_chitu_admin_2 = require("maishu-chitu-admin");
    exports.app = maishu_chitu_admin_2.app;
    const user_1 = require("./services/user");
    var user_2 = require("./services/user");
    exports.UserService = user_2.UserService;
    const React = require("react");
    maishu_chitu_admin_1.app.masterPage.setHideMenuPages(['forget-password', 'login', 'register']);
    class Toolbar extends React.Component {
        constructor(props) {
            super(props);
            this.pageShowin = (sender, page) => {
                this.setState({ currentPageName: page.name });
            };
            this.state = { currentPageName: null };
            this.init();
        }
        init() {
            const LOGIN_INFO = 'app-login-info';
            if (localStorage[LOGIN_INFO]) {
                let obj = JSON.parse(localStorage[LOGIN_INFO]);
                user_1.UserService.loginInfo.value = obj;
                // this.loadUserInfo(this.loginInfo.value.userId)
                // instanceMessangerStart(UserService.loginInfo.value.userId, this.createService(MessageService))
            }
            user_1.UserService.loginInfo.add((value) => {
                if (!value) {
                    localStorage.removeItem(LOGIN_INFO);
                    // this.isDistributorAuth.value = false
                    // this.isPersonAuth.value = false
                    // instanceMessangerStop()
                }
                else {
                    localStorage.setItem(LOGIN_INFO, JSON.stringify(value));
                    // this.loadUserInfo(value.userId)
                    // instanceMessangerStart(value.userId, this.createService(MessageService))
                }
            });
        }
        get userId() {
            if (user_1.UserService.loginInfo.value == null)
                return null;
            return user_1.UserService.loginInfo.value.userId;
        }
        componentDidMount() {
            maishu_chitu_admin_1.app.pageShowing.add(this.pageShowin);
        }
        componentWillUnmount() {
            maishu_chitu_admin_1.app.pageShowing.remove(this.pageShowin);
        }
        render() {
            let showLoginButton = ['forget-password', 'login', 'register'].indexOf(this.state.currentPageName) < 0;
            return React.createElement("ul", null, showLoginButton ? React.createElement("li", { className: "light-blue pull-right", style: { color: 'white', paddingTop: 4, cursor: 'pointer' }, onClick: () => {
                    logout();
                    maishu_chitu_admin_1.app.redirect('login');
                } },
                React.createElement("i", { className: "icon-off" }),
                React.createElement("span", { style: { paddingLeft: 4 } }, "\u9000\u51FA")) : null);
        }
    }
    function logout() {
        let userService = maishu_chitu_admin_1.app.createService(user_1.UserService);
        userService.logout();
    }
    exports.logout = logout;
    maishu_chitu_admin_1.app.masterPage.setToolbar(React.createElement(Toolbar, null));
});

},{"./services/user":4,"maishu-chitu-admin":"maishu-chitu-admin","react":"react"}],2:[function(require,module,exports){
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

},{"../config":2,"./service":3}]},{},[1])(1)
});

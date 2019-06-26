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
        define(["require", "exports", "react", "maishu-dilu", "../services/user", "maishu-ui-toolkit", "../config"], factory);
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

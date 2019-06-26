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

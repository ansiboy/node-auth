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
    // app.error.add((sender, error, page) => {
    //     ui.alert({ title: '错误', message: error.message })
    // })
    let userService = maishu_chitu_admin_1.app.createService(user_1.UserService);
    // userService.resources().then(resources => {
    //     let menus = resources.filter(o => o.parent_id == null)
    //         .map(o => ({
    //             id: o.id, name: o.name, visible: o.visible,
    //             path: `${o.path}?resource_id=${o.id}`
    //         } as Menu))
    //     for (let i = 0; i < menus.length; i++) {
    //         menus[i].children = resources.filter(o => o.parent_id == menus[i].id)
    //             .map(o => ({
    //                 id: o.id,
    //                 name: o.name,
    //                 path: o.path,
    //                 parent: menus[i],
    //                 visible: o.visible,
    //             } as Menu))
    //     }
    //     app.masterPage.setMenus(menus)
    // })
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

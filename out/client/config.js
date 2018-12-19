// interface Config {
//     firstPanelWidth: string,
//     authServiceHost: string,
//     menuType: string,
//     login: {
//         title: string,
//         showForgetPassword: boolean,
//         showRegister: boolean,
//     }
// }
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
    // let defaultConfig = {
    //     login: { showForgetPassword: true, showRegister: true }
    // } as Config
    // export let config: Config = window['adminConfig'] || {}
    // config.login = Object.assign(defaultConfig.login, config.login || {})
    const maishu_chitu_admin_1 = require("maishu-chitu-admin");
    maishu_chitu_admin_1.app.config.login = Object.assign({
        showForgetPassword: true, showRegister: true
    }, maishu_chitu_admin_1.app.config.login || {});
    exports.config = maishu_chitu_admin_1.app.config;
});

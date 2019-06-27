(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-services-sdk", "./settings"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    const settings = require("./settings");
    exports.g = window['chitu-admin-global'] = window['chitu-admin-global'] || {};
    function default_1(app) {
        console.assert(app != null);
        exports.g.app = app;
        requirejs(['css!site.css']);
        maishu_services_sdk_1.PermissionService.baseUrl = `http://${settings.gatewayHost}`;
    }
    exports.default = default_1;
});

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errors = {
        argumentNull(name) {
            return new Error(`Argument ${name} cannt be null or empty.`);
        },
        dataSourceNotExists(name) {
            return new Error(`Data source ${name} is not exists.`);
        },
        mobileBindsDistributor(mobile) {
            let msg = `账号 ${mobile} 已经绑定到另外一个经销商`;
            return new Error(msg);
        },
        argumentFieldNull(argumentName, fieldName) {
            return new Error(`Argument ${argumentName} field ${fieldName} cannt ben null or emtpy.`);
        },
        distributorNotAllowDelete() {
            return new Error('经销商不允许删除');
        },
        brandExists(name) {
            return new Error(`品牌"${name}"已存在`);
        },
        userExists(mobile) {
            return new Error(`用户"${mobile}"已经存在`);
        },
        notImplement() {
            return new Error('Not implement.');
        }
    };
});

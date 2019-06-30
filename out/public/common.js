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
    exports.platformCategory = 'platform';
    exports.distributorCategory = 'distributor';
    exports.categroyNames = [{ name: "平台", value: exports.platformCategory }, { name: "经销商", value: exports.distributorCategory }];
});

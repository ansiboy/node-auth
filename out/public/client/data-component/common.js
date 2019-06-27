(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-services-sdk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    exports.constants = {
        pageSize: 15,
        buttonTexts: {
            add: '添加',
            edit: '修改',
            delete: '删除',
            view: '查看'
        },
        noImage: '暂无图片',
        base64SrcPrefix: 'data:image',
    };
    exports.services = {
        imageService: new maishu_services_sdk_1.ImageService()
    };
});

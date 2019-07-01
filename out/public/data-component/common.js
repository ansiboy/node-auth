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
        define(["require", "exports", "maishu-services-sdk", "maishu-chitu", "maishu-wuzhui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    const maishu_chitu_1 = require("maishu-chitu");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
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
    function getObjectType(url) {
        // let url = location.hash.substr(1);
        let obj = maishu_chitu_1.parseUrl(url);
        let arr = obj.pageName.split('/');
        return arr[0];
    }
    exports.getObjectType = getObjectType;
    function toDataSource(source) {
        return new maishu_wuzhui_1.DataSource({
            select: () => __awaiter(this, void 0, void 0, function* () {
                let items = yield source;
                return { dataItems: items, totalRowCount: items.length };
            })
        });
    }
    exports.toDataSource = toDataSource;
});

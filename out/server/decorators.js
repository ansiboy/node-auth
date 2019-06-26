"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
const token_1 = require("./token");
const querystring = require("querystring");
const url = require("url");
exports.UserId = maishu_node_mvc_1.createParameterDecorator((req) => __awaiter(this, void 0, void 0, function* () {
    let tokenText = req.headers['token'];
    if (!tokenText)
        return null;
    let token = yield token_1.Token.parse(tokenText);
    if (!token)
        return null;
    try {
        var obj = JSON.parse(token.content);
        let userId = obj.UserId || obj.user_id;
        return userId;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}));
exports.ApplicationId = maishu_node_mvc_1.createParameterDecorator((req) => __awaiter(this, void 0, void 0, function* () {
    let appId = req.headers['application-id'];
    if (appId)
        return appId;
    let formData = getFormData(req);
    return formData['application-id'];
}));
function getFormData(req) {
    return __awaiter(this, void 0, void 0, function* () {
        function getPostObject(request) {
            let length = request.headers['content-length'] || 0;
            let contentType = request.headers['content-type'];
            if (length <= 0)
                return Promise.resolve({});
            return new Promise((reslove, reject) => {
                var text = "";
                request.on('data', (data) => {
                    text = text + data.toString();
                });
                request.on('end', () => {
                    let obj;
                    try {
                        if (contentType.indexOf('application/json') >= 0) {
                            obj = JSON.parse(text);
                        }
                        else {
                            obj = querystring.parse(text);
                        }
                        reslove(obj);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            });
        }
        /**
         *
         * @param request 获取 QueryString 里的对象
         */
        function getQueryObject(request) {
            let contentType = request.headers['content-type'];
            let obj = {};
            if (contentType != null && contentType.indexOf('application/json') >= 0) {
                let arr = (request.url || '').split('?');
                let str = arr[1];
                if (str != null) {
                    str = decodeURI(str);
                    obj = JSON.parse(str); //TODO：异常处理
                }
            }
            else {
                let urlInfo = url.parse(request.url || '');
                let { search } = urlInfo;
                if (search) {
                    obj = querystring.parse(search.substr(1));
                }
            }
            return obj;
        }
        if (req.method == 'GET') {
            let queryData = getQueryObject(req);
            // dataPromise = Promise.resolve(queryData);
            return queryData;
        }
        // else {
        let queryData = getQueryObject(req);
        let data = yield getPostObject(req);
        console.assert(queryData != null);
        data = Object.assign(data, queryData);
        return data;
        // }
    });
}
//# sourceMappingURL=decorators.js.map
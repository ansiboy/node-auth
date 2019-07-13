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
const http = require("http");
const errors_1 = require("./errors");
const url = require("url");
const settings = require("./settings");
const token_1 = require("./token");
const querystring = require("querystring");
const isClass = require('is-class');
let server = http.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
    serverCallback(req, res)
        .catch(err => {
        outputError(res, err);
    });
}));
server.listen(settings.port, settings.bindIP);
function checkPermission(token, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let u = url.parse(req.url);
        console.log(req.url);
        let pathname = u.pathname || '';
        var arr = pathname.split('/');
        return true;
    });
}
let innerControllers = ['application', 'resource', 'role', 'user', 'sms'];
function serverCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        setHeaders(res);
        console.assert(req.method != null);
        if (req.method.toLowerCase() == 'options') {
            res.statusCode = 204;
            res.end();
            return;
        }
        let token = null;
        let tokenText = req.headers['token'];
        if (typeof tokenText == "object") {
            tokenText = tokenText[0];
        }
        if (tokenText) {
            token = yield token_1.TokenManager.parse(tokenText);
        }
        // 检查权限
        let isPass = yield checkPermission(token, req);
        if (isPass == false) {
            return Promise.reject(errors_1.errors.forbidden(req.url));
        }
        //TODO:如果是内置模块，则执行内置模块
        let requestUrl = req.url || '';
        let urlInfo = url.parse(requestUrl);
        let arr = (urlInfo.pathname || '').split('/').filter(o => o);
        let [controllerName, actionName] = arr;
        if (controllerName != null && actionName != null && innerControllers.indexOf(controllerName) >= 0) {
            yield executeAction(controllerName, actionName, token, req, res);
            return;
        }
        let { host, path, port } = yield getRedirectInfo(req);
        let request = createTargetResquest(host, path, port, token, req, res);
        request.on('error', function (err) {
            outputError(res, err);
        });
        req.on('data', (data) => {
            request.write(data);
        });
        req.on('end', () => {
            request.end();
        });
    });
}
function executeAction(controllerName, actionName, token, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let controller = require(`./controllers/${controllerName}`);
        if (controller.default != null)
            controller = controller.default;
        if (isClass(controller))
            controller = new controller();
        let action = controller[actionName];
        if (action == null) {
            throw errors_1.errors.actionNotExists(controllerName, actionName);
        }
        let dataPromise;
        if (req.method == 'GET') {
            let queryData = getQueryObject(req);
            dataPromise = Promise.resolve(queryData);
        }
        else {
            dataPromise = getPostObject(req);
        }
        let data = yield dataPromise;
        let appId = data['application-id'] || req.headers['application-id'];
        if (appId) {
            Object.assign(data, { appId, APP_ID: appId });
        }
        if (token != null && (token.content_type || '').indexOf('json') > 0) {
            var obj = JSON.parse(token.content);
            let userId = obj.UserId || obj.user_id;
            if (userId) {
                data = Object.assign({ userId }, data || {}, { USER_ID: userId });
            }
        }
        let result = action.apply(controller, [data, req, res]);
        if (result instanceof Promise) {
            result.then(r => {
                outputResult(r, res);
            }).catch(e => {
                outputError(res, e);
            });
            return;
        }
        outputResult(result, res);
    });
}
function outputResult(result, res) {
    result = result === undefined ? null : result;
    let contentResult;
    if (result instanceof ContentResult) {
        contentResult = result;
    }
    else {
        contentResult = typeof result == 'string' ?
            new ContentResult(result, exports.contentTypes.text_plain, 200) :
            new ContentResult(JSON.stringify(result), exports.contentTypes.application_json, 200);
    }
    res.setHeader("content-type", contentResult.contentType || exports.contentTypes.text_plain);
    res.statusCode = contentResult.statusCode || 200;
    res.end(contentResult.data);
}
exports.contentTypes = {
    application_json: 'application/json',
    text_plain: 'text/plain',
};
class ContentResult {
    constructor(data, contentType, statusCode) {
        this.data = data;
        this.contentType = contentType;
        this.statusCode = statusCode == null ? 200 : statusCode;
    }
}
exports.ContentResult = ContentResult;
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
function getPostObject(request) {
    let length = request.headers['content-length'] || 0;
    let contentType = request.headers['content-type'];
    if (length <= 0)
        return Promise.resolve({});
    return new Promise((reslove, reject) => {
        request.on('data', (data) => {
            let text = data.toString();
            try {
                let obj;
                if (contentType.indexOf('application/json') >= 0) {
                    obj = JSON.parse(text);
                }
                else {
                    obj = querystring.parse(text);
                }
                reslove(obj);
            }
            catch (exc) {
                let err = errors_1.errors.postDataNotJSON(text);
                console.assert(err != null);
                reject(err);
            }
        });
    });
}
function createTargetResquest(host, path, port, token, req, res) {
    let headers = req.headers;
    if (token != null && (token.content_type || '').indexOf('json') > 0) {
        var obj = JSON.parse(token.content);
        for (let key in obj) {
            headers[key] = obj[key];
        }
    }
    let request = http.request({
        host: host,
        path: path,
        method: req.method,
        headers: headers,
        port: port
    }, (response) => {
        console.assert(response != null);
        const StatusCodeGenerateToken = 666; // 生成 Token
        if (response.statusCode == StatusCodeGenerateToken) {
            let responseContent;
            let contentType = response.headers['content-type'];
            response.on('data', (data) => {
                responseContent = data.toString();
            });
            response.on('end', () => {
                token_1.TokenManager.create(responseContent, contentType)
                    .then((o) => {
                    res.setHeader("content-type", "application/json");
                    var obj = JSON.stringify({ token: o.id });
                    res.write(obj);
                    res.end();
                }).catch(err => {
                    outputError(res, err);
                });
            });
        }
        else {
            for (var key in response.headers) {
                res.setHeader(key, response.headers[key]);
            }
            res.statusCode = response.statusCode;
            res.statusMessage = response.statusMessage;
            response.pipe(res);
        }
    });
    return request;
}
function outputError(response, err) {
    if (err == null) {
        err = new Error('Error is null');
        err.name = 'NullError';
    }
    const StatusCodeDefaultError = 600;
    response.statusCode = StatusCodeDefaultError;
    response.statusMessage = err.name; // statusMessage 不能为中文，否则会出现 invalid chartset 的异常
    if (/^\d\d\d\s/.test(err.name)) {
        response.statusCode = Number.parseInt(err.name.substr(0, 3));
        err.name = err.name.substr(4);
    }
    let outputObject = { message: err.message, name: err.name, stack: err.stack };
    let str = JSON.stringify(outputObject);
    response.write(str);
    response.end();
}
function setHeaders(res) {
    // res.setHeader('Content-Type', 'application/json;charset=utf-8');
    // res.setHeader('node_auth_machine', settings.MACHINE_NAME);
    for (let i = 0; i < settings.headers.length; i++) {
        let header = settings.headers[i];
        res.setHeader(header.name, header.value);
    }
}
function getRedirectInfo(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let redirectInfos = settings.redirectInfos; //application.redirects || [];
        let u1 = url.parse(req.url);
        let arr = u1.path.split('/').filter(o => o);
        let rootDir = arr.shift(); // 获取请求路径的根目录
        let path = arr.join('/'); // 获取相对于根目录的路径
        let redirectInfo = redirectInfos.pathInfos.filter(o => o.rootDir == rootDir)[0];
        if (redirectInfo == null)
            throw errors_1.errors.canntGetRedirectUrl(rootDir);
        let target = combinePaths(redirectInfo.targetUrl, path);
        let u = url.parse(target);
        return { host: u.hostname, path: u.path, port: new Number(u.port).valueOf() };
    });
}
function combinePaths(path1, path2) {
    console.assert(path1 != null && path2 != null);
    if (!path1.endsWith('/')) {
        path1 = path1 + '/';
    }
    if (path2[0] == '/') {
        path2 = path2.substr(1);
    }
    return path1 + path2;
}
process.on('unhandledRejection', (reason, p) => {
    console.log(reason);
});
//# sourceMappingURL=app.js.map
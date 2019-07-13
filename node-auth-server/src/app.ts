import * as http from 'http';
import { errors } from './errors';
import * as url from 'url';
import * as settings from './settings';
import { TokenManager } from './token';
import querystring = require('querystring');
import { Token } from './entities';

const isClass = require('is-class')

let server = http.createServer(async (req, res) => {
    serverCallback(req, res)
        .catch(err => {
            outputError(res, err);
        });
});

server.listen(settings.port, settings.bindIP);


async function checkPermission(token: Token, req: http.IncomingMessage): Promise<boolean> {
    let u = url.parse(req.url)
    console.log(req.url)
    let pathname = u.pathname || '';
    var arr = pathname.split('/');

    return true
}

let innerControllers = ['application', 'resource', 'role', 'user', 'sms']
async function serverCallback(req: http.IncomingMessage, res: http.ServerResponse) {

    setHeaders(res);
    console.assert(req.method != null);
    if (req.method.toLowerCase() == 'options') {
        res.statusCode = 204;
        res.end();
        return;
    }

    let token: Token = null;
    let tokenText = req.headers['token'] as string;
    if (typeof tokenText == "object") {
        tokenText = tokenText[0];
    }

    if (tokenText) {
        token = await TokenManager.parse(tokenText);
    }

    // 检查权限
    let isPass = await checkPermission(token, req);
    if (isPass == false) {
        return Promise.reject(errors.forbidden(req.url));
    }

    //TODO:如果是内置模块，则执行内置模块
    let requestUrl = req.url || ''
    let urlInfo = url.parse(requestUrl);
    let arr = (urlInfo.pathname || '').split('/').filter(o => o)
    let [controllerName, actionName] = arr
    if (controllerName != null && actionName != null && innerControllers.indexOf(controllerName) >= 0) {
        await executeAction(controllerName, actionName, token, req, res)
        return
    }

    let { host, path, port } = await getRedirectInfo(req)

    let request = createTargetResquest(host, path, port, token, req, res);

    request.on('error', function (err) {
        outputError(res, err);
    })

    req.on('data', (data) => {
        request.write(data);
    })
    req.on('end', () => {
        request.end();
    })
}

async function executeAction(controllerName: string, actionName: string, token: Token, req: http.IncomingMessage, res: http.ServerResponse) {
    let controller = require(`./controllers/${controllerName}`)
    if (controller.default != null)
        controller = controller.default

    if (isClass(controller))
        controller = new controller()

    let action = controller[actionName] as Function;
    if (action == null) {
        throw errors.actionNotExists(controllerName, actionName);
    }

    let dataPromise: Promise<any>;
    if (req.method == 'GET') {
        let queryData = getQueryObject(req);
        dataPromise = Promise.resolve(queryData);
    }
    else {
        dataPromise = getPostObject(req);
    }

    let data = await dataPromise
    let appId = data['application-id'] || req.headers['application-id']
    if (appId) {
        Object.assign(data, { appId, APP_ID: appId })
    }

    if (token != null && (token.content_type || '').indexOf('json') > 0) {
        var obj = JSON.parse(token.content);
        let userId = obj.UserId || (obj as UserToken).user_id
        if (userId) {
            data = Object.assign({ userId }, data || {}, { USER_ID: userId })
        }
    }

    let result = action.apply(controller, [data, req, res])
    if (result instanceof Promise) {
        result.then(r => {
            outputResult(r, res)
        }).catch(e => {
            outputError(res, e)
        })

        return
    }
    outputResult(result, res)
}

function outputResult(result: object | null, res: http.ServerResponse) {
    result = result === undefined ? null : result
    let contentResult: ContentResult
    if (result instanceof ContentResult) {
        contentResult = result
    }
    else {
        contentResult = typeof result == 'string' ?
            new ContentResult(result, contentTypes.text_plain, 200) :
            new ContentResult(JSON.stringify(result), contentTypes.application_json, 200)
    }

    res.setHeader("content-type", contentResult.contentType || contentTypes.text_plain);
    res.statusCode = contentResult.statusCode || 200;
    res.end(contentResult.data);
}

export const contentTypes = {
    application_json: 'application/json',
    text_plain: 'text/plain',
}

export class ContentResult {
    data: string
    statusCode: number
    contentType: string
    constructor(data: string, contentType: string, statusCode?: number) {
        this.data = data
        this.contentType = contentType
        this.statusCode = statusCode == null ? 200 : statusCode
    }
}


/**
 * 
 * @param request 获取 QueryString 里的对象
 */
function getQueryObject(request: http.IncomingMessage): { [key: string]: any } {
    let contentType = request.headers['content-type'] as string;
    let obj: { [key: string]: any } = {};
    if (contentType != null && contentType.indexOf('application/json') >= 0) {
        let arr = (request.url || '').split('?');
        let str = arr[1]
        if (str != null) {
            str = decodeURI(str);
            obj = JSON.parse(str);  //TODO：异常处理
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


function getPostObject(request: http.IncomingMessage): Promise<any> {
    let length = request.headers['content-length'] || 0;
    let contentType = request.headers['content-type'] as string;
    if (length <= 0)
        return Promise.resolve({});

    return new Promise((reslove, reject) => {
        request.on('data', (data: { toString: () => string }) => {
            let text = data.toString();
            try {
                let obj;
                if (contentType.indexOf('application/json') >= 0) {
                    obj = JSON.parse(text)
                }
                else {
                    obj = querystring.parse(text);
                }

                reslove(obj);
            }
            catch (exc) {
                let err = errors.postDataNotJSON(text);
                console.assert(err != null);
                reject(err);
            }
        });
    });
}

function createTargetResquest(host: string, path: string, port: number, token: Token, req: http.IncomingMessage, res: http.ServerResponse) {

    let headers: any = req.headers;
    if (token != null && (token.content_type || '').indexOf('json') > 0) {
        var obj = JSON.parse(token.content);
        for (let key in obj) {
            headers[key] = obj[key];
        }
    }

    let request = http.request(
        {
            host: host,
            path: path,
            method: req.method,
            headers: headers,
            port: port
        },
        (response) => {
            console.assert(response != null);

            const StatusCodeGenerateToken = 666; // 生成 Token
            if (response.statusCode == StatusCodeGenerateToken) {
                let responseContent: string;
                let contentType = response.headers['content-type'] as string;
                response.on('data', (data: ArrayBuffer) => {
                    responseContent = data.toString();
                })
                response.on('end', () => {
                    TokenManager.create(responseContent, contentType)
                        .then((o: Token) => {
                            res.setHeader("content-type", "application/json");
                            var obj = JSON.stringify({ token: o.id });
                            res.write(obj);
                            res.end();
                        }).catch(err => {
                            outputError(res, err);
                        })
                })
            }
            else {
                for (var key in response.headers) {
                    res.setHeader(key, response.headers[key]);
                }
                res.statusCode = response.statusCode;
                res.statusMessage = response.statusMessage
                response.pipe(res);
            }
        },
    );

    return request;
}

function outputError(response: http.ServerResponse, err: Error) {
    if (err == null) {
        err = new Error('Error is null')
        err.name = 'NullError'
    }

    const StatusCodeDefaultError = 600;

    response.statusCode = StatusCodeDefaultError;
    response.statusMessage = err.name;      // statusMessage 不能为中文，否则会出现 invalid chartset 的异常

    if (/^\d\d\d\s/.test(err.name)) {
        response.statusCode = Number.parseInt(err.name.substr(0, 3));
        err.name = err.name.substr(4);
    }

    let outputObject = { message: err.message, name: err.name, stack: err.stack };
    let str = JSON.stringify(outputObject);
    response.write(str);
    response.end();
}



function setHeaders(res: http.ServerResponse) {
    // res.setHeader('Content-Type', 'application/json;charset=utf-8');
    // res.setHeader('node_auth_machine', settings.MACHINE_NAME);
    for (let i = 0; i < settings.headers.length; i++) {
        let header = settings.headers[i];
        res.setHeader(header.name, header.value);
    }
}


type RediectInfo = { host: string, path: string, port: number };
async function getRedirectInfo(req: http.IncomingMessage): Promise<RediectInfo> {

    let redirectInfos = settings.redirectInfos; //application.redirects || [];

    let u1 = url.parse(req.url);
    let arr = u1.path.split('/').filter(o => o);
    let rootDir = arr.shift();      // 获取请求路径的根目录
    let path = arr.join('/');       // 获取相对于根目录的路径

    let redirectInfo = redirectInfos.pathInfos.filter(o => o.rootDir == rootDir)[0];
    if (redirectInfo == null)
        throw errors.canntGetRedirectUrl(rootDir);

    let target = combinePaths(redirectInfo.targetUrl, path);
    let u = url.parse(target);
    return { host: u.hostname, path: u.path, port: new Number(u.port).valueOf() };
}

function combinePaths(path1: string, path2: string) {
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



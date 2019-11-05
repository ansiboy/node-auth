import { createParameterDecorator } from 'maishu-node-mvc'
import { TokenManager } from './token';
import http = require('http')
import querystring = require('querystring');
import url = require('url');
import { AuthDataContext, createDataContext } from './data-context';
import { errors } from './errors';
import Cookies = require('cookies');
import { constants } from './common';
import { g } from './global';

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        let dc = await createDataContext(g.authConn);
        return dc
    },
    async (dc) => {
        await dc.dispose()
    }
)

export let currentUserId = createParameterDecorator(async (req, res) => {
    return getUserIdFromRequest(req, res);
})

export async function getUserIdFromRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    let routeData = getQueryObject(req);
    let cookies = new Cookies(req, res);
    let tokenText = (req.headers['token'] as string) || routeData["token"] || cookies.get(constants.cookieToken);

    if (!tokenText)
        return null

    let token = await TokenManager.parse(tokenText);
    if (!token)
        return null

    try {
        var obj = JSON.parse(token.content);
        let userId = obj.UserId || (obj as UserToken).user_id
        return userId
    }
    catch (err) {
        console.error(err)
        return null
    }
}

export let currentUser = createParameterDecorator(async (req, res) => {
    let routeData = await getQueryObject(req);
    let cookies = new Cookies(req, res);
    let tokenText = (req.headers['token'] as string) || routeData["token"] || cookies.get(constants.cookieToken);
    if (!tokenText)
        return null

    let token = await TokenManager.parse(tokenText);
    if (!token)
        return null

    try {
        var obj = JSON.parse(token.content);
        let userId = obj.UserId || (obj as UserToken).user_id;
        let dc = await createDataContext(g.authConn);
        let user = await dc.users.findOne(userId);
        if (!user)
            throw errors.objectNotExistWithId(userId, "User");

        return user;
    }
    catch (err) {
        console.error(err)
        return null
    }
})

export let currentTokenId = createParameterDecorator(async (req) => {
    let routeData = await getQueryObject(req);
    let tokenText = (req.headers['token'] as string) || routeData["token"];
    return tokenText;
})

export let ApplicationId = createParameterDecorator(async (req) => {
    let appId = req.headers['application-id']
    if (appId)
        return appId

    let routeData = getQueryObject(req)
    return routeData['application-id']
})

/**
 * 
 * @param request 获取 QueryString 里的对象
 */
function getQueryObject(request: http.IncomingMessage): { [key: string]: any } {
    let contentType = request.headers['content-type'] as string;
    let obj: { [key: string]: any } = {};
    let urlInfo = url.parse(request.url || '');
    let { query } = urlInfo;

    if (!query) {
        return obj;
    }

    query = decodeURIComponent(query);
    let queryIsJSON = (contentType != null && contentType.indexOf('application/json') >= 0) ||
        (query != null && query[0] == '{' && query[query.length - 1] == '}')

    if (queryIsJSON) {
        let arr = (request.url || '').split('?');
        let str = arr[1]
        if (str != null) {
            str = decodeURIComponent(str);
            obj = JSON.parse(str);  //TODO：异常处理
        }
    }
    else {
        obj = querystring.parse(query);
    }

    return obj;
}



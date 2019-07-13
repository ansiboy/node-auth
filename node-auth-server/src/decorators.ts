import { createParameterDecorator } from 'maishu-node-mvc'
import { TokenManager } from './token';
import http = require('http')
import querystring = require('querystring');
import url = require('url');
import { createDataContext } from './dataContext';
import { errors } from './errors';

export let currentUserId = createParameterDecorator(async (req) => {
    let formData = await getQueryObject(req);
    let tokenText = (req.headers['token'] as string) || formData["token"];
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
})

export let currentUser = createParameterDecorator(async (req) => {
    let formData = await getQueryObject(req);
    let tokenText = (req.headers['token'] as string) || formData["token"];
    if (!tokenText)
        return null

    let token = await TokenManager.parse(tokenText);
    if (!token)
        return null

    try {
        var obj = JSON.parse(token.content);
        let userId = obj.UserId || (obj as UserToken).user_id;
        let dc = await createDataContext();
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
    let formData = await getQueryObject(req);
    let tokenText = (req.headers['token'] as string) || formData["token"];
    return tokenText;
})

export let ApplicationId = createParameterDecorator(async (req) => {
    let appId = req.headers['application-id']
    if (appId)
        return appId

    let formData = getQueryObject(req)
    return formData['application-id']
})

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


// async function getFormData(req: http.IncomingMessage) {

//     function getPostObject(request: http.IncomingMessage): Promise<any> {
//         let length = request.headers['content-length'] || 0;
//         let contentType = request.headers['content-type'] as string;
//         if (length <= 0)
//             return Promise.resolve({});

//         return new Promise((reslove, reject) => {
//             var text = "";
//             request.on('data', (data: { toString: () => string }) => {
//                 text = text + data.toString();
//             });

//             request.on('end', () => {
//                 let obj;
//                 try {
//                     if (contentType.indexOf('application/json') >= 0) {
//                         obj = JSON.parse(text)
//                     }
//                     else {
//                         obj = querystring.parse(text);
//                     }
//                     reslove(obj);
//                 }
//                 catch (err) {
//                     reject(err);
//                 }
//             })
//         });
//     }

//     /**
//      * 
//      * @param request 获取 QueryString 里的对象
//      */



//     if (req.method == 'GET') {
//         let queryData = getQueryObject(req);
//         // dataPromise = Promise.resolve(queryData);
//         return queryData
//     }
//     // else {
//     let queryData = getQueryObject(req);
//     let data = await getPostObject(req);

//     console.assert(queryData != null)
//     data = Object.assign(data, queryData)
//     return data
//     // }
// }
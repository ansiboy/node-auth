import { errors } from './errors';
import * as mysql from 'mysql';
import * as cache from 'memory-cache';
import { createDataContext } from './data-context';
import { TokenData } from './entities';
import { IncomingMessage } from "http";
import Cookies = require("cookies");
import * as url from "url";
import { g, guid } from './global';
import querystring = require('querystring');
import { getLogger } from "maishu-node-mvc";


type MyTokenData = TokenData & { cacheDateTime?: number };

/**
 * 用于解释和生成 token 。
 */
export class TokenManager {
    static async create(userId: string, roleIds?: string): Promise<TokenData> {
        if (userId == null) throw errors.argumentNull("userId");
        let token = new TokenData();


        token.id = guid();
        token.user_id = userId;
        token.role_ids = roleIds;
        token.create_date_time = new Date(Date.now());

        console.assert(g.settings.db != null);
        let dc = await createDataContext(g.settings.db);
        await dc.tokenDatas.save(token);
        return token;
    }

    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static async parse(token: string): Promise<TokenData> {

        if (!token)
            return Promise.reject(errors.argumentNull('tokenValue'));

        let tokenData: MyTokenData = cache.get(token);

        if (tokenData == null) {
            let dc = await createDataContext(g.settings.db);
            let tokenData = await dc.tokenDatas.findOne(token) as MyTokenData;
            if (tokenData != null) {
                tokenData.cacheDateTime = Date.now();
                cache.put(token, tokenData);
            }
        }

        return tokenData;
    }

    static async remove(id: string) {
        console.assert(g.settings.db != null);
        let dc = await createDataContext(g.settings.db);
        await dc.tokenDatas.delete({ id });
    }
}

setInterval(() => {

    let keys = cache.keys() || [];
    for (let i = 0; i < keys.length; i++) {
        let token: MyTokenData = cache.get(keys[i]);
        if (token == null) {
            cache.del(keys[i]);
            continue;
        }

        console.assert(token != null);
        let interval = Date.now() - (token.cacheDateTime || 0);
        let hour = 1000 * 60 * 60;
        if (interval > hour * 2) {
            cache.del(keys[i]);
        }
    }

}, 1000 * 60 * 60);

export async function getToken(req: IncomingMessage) {

    let logger = getLogger(g.projectName, g.settings.logLevel);

    let cookies = new Cookies(req, null);

    let urlInfo = url.parse(req.url || "");
    let urlParams = querystring.parse(urlInfo.query || "");
    let tokenText: string = req.headers['token'] as string || urlParams["token"] as string || cookies.get("token");

    if (!tokenText)
        return null;

    //============================================
    // token text 多了两个 "，要去除掉
    tokenText = tokenText.replace(/"/g, "");
    //============================================
    let token = await TokenManager.parse(tokenText);
    if (token == null) {
        logger.warn(`Token '${tokenText}' is not exists`)
    }
    return token;
}

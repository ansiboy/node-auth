import { errors } from './errors';
import * as settings from './config';
import * as mysql from 'mysql';
import * as cache from 'memory-cache';
import { createDataContext } from './data-context';
import { Token } from './entities';
import { guid } from './utility';
import { IncomingMessage } from "http";
import Cookies = require("cookies");
import * as url from "url";
import { g } from './global';
import querystring = require('querystring');
import { getLogger } from "maishu-node-mvc";

const tableName = 'token';

type MyToken = Token & { cacheDateTime?: number };

function mongoObjectId(): string {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

function execute<T>(callback: (collection: mysql.Connection) => Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
        let conn = mysql.createConnection(g.authConn);
        callback(conn)
            .then((result) => {
                conn.end();
                resolve(result);
            })
            .catch(err => {
                conn.end();
                reject(err);
            });
    });
}

function query(conn: mysql.Connection, sql: string, value?: any): Promise<[any[], mysql.FieldInfo[]]> {
    return new Promise((resolve, reject) => {
        conn.query(sql, value, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            resolve([rows, fields]);
        })
    });
}

/**
 * 用于解释和生成 token 。
 */
export class TokenManager {
    static async create(content: object): Promise<Token> {
        if (content == null) throw errors.argumentNull("content");
        let token = new Token();


        token.id = guid();
        token.content = JSON.stringify(content);
        token.content_type = 'application/json';
        token.create_date_time = new Date(Date.now());

        console.assert(g.authConn != null);
        let dc = await createDataContext(g.authConn);
        try {
            await dc.tokens.save(token);
            return token;
        }
        finally {
            dc.dispose();
        }
    }

    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static async parse(tokenValue: string): Promise<Token> {

        if (!tokenValue)
            return Promise.reject(errors.argumentNull('tokenValue'));

        let token: MyToken = cache.get(tokenValue);

        if (token == null) {
            token = await execute(async (conn) => {
                let sql = `select * from ${tableName} where id = ?`;
                let [rows, fields] = await query(conn, sql, tokenValue);
                return rows[0];
            })

            if (token != null) {
                token.cacheDateTime = Date.now();
                cache.put(tokenValue, token);
            }
        }

        return token;
    }

    static async remove(id: string) {
        console.assert(g.authConn != null);
        let dc = await createDataContext(g.authConn);
        try {
            await dc.tokens.delete({ id });
        }
        finally {
            dc.dispose();
        }
    }
}

setInterval(() => {

    let keys = cache.keys() || [];
    for (let i = 0; i < keys.length; i++) {
        let token: MyToken = cache.get(keys[i]);
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

    let logger = getLogger(settings.PROJECt_NAME, g.settings.logLevel);

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

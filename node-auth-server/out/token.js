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
const errors_1 = require("./errors");
const settings = require("./settings");
const mysql = require("mysql");
const cache = require("memory-cache");
const dataContext_1 = require("./dataContext");
const entities_1 = require("./entities");
const utility_1 = require("./utility");
const tableName = 'token';
function mongoObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}
;
function execute(callback) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let conn = mysql.createConnection(settings.conn.auth);
        callback(conn)
            .then((result) => {
            conn.end();
            resolve(result);
        })
            .catch(err => {
            conn.end();
            reject(err);
        });
    }));
}
function query(conn, sql, value) {
    return new Promise((resolve, reject) => {
        conn.query(sql, value, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }
            resolve([rows, fields]);
        });
    });
}
/**
 * 用于解释和生成 token 。
 */
class TokenManager {
    static create(content, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = new entities_1.Token();
            if (typeof content == 'object') {
                content = JSON.stringify(content);
                contentType = 'application/json';
            }
            token.id = utility_1.guid();
            token.content = content;
            token.content_type = contentType;
            token.create_date_time = new Date(Date.now());
            let dc = yield dataContext_1.getDataContext();
            try {
                yield dc.tokens.save(token);
                return token;
            }
            finally {
                dc.dispose();
            }
        });
    }
    /**
     * 对令牌字符串进行解释，转换为令牌对象
     * @param appId 应用ID
     * @tokenValue 令牌字符串
     */
    static parse(tokenValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tokenValue)
                return Promise.reject(errors_1.errors.argumentNull('tokenValue'));
            let token = cache.get(tokenValue);
            if (token == null) {
                token = yield execute((conn) => __awaiter(this, void 0, void 0, function* () {
                    let sql = `select * from ${tableName} where id = ?`;
                    let [rows, fields] = yield query(conn, sql, tokenValue);
                    return rows[0];
                }));
                if (token != null) {
                    token.cacheDateTime = Date.now();
                    cache.put(tokenValue, token);
                }
            }
            return token;
        });
    }
    static remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let dc = yield dataContext_1.getDataContext();
            try {
                yield dc.tokens.delete({ id });
            }
            finally {
                dc.dispose();
            }
        });
    }
}
exports.TokenManager = TokenManager;
setInterval(() => {
    let keys = cache.keys() || [];
    for (let i = 0; i < keys.length; i++) {
        let token = cache.get(keys[i]);
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
//# sourceMappingURL=token.js.map
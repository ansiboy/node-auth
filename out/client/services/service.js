(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-chitu"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chitu = require("maishu-chitu");
    class Service extends chitu.Service {
        constructor() {
            super();
        }
        ajax(url, options) {
            return super.ajax(url, options).then((data) => {
                if (data != null && data['DataItems'] != null && data['TotalRowCount'] != null) {
                    let d = {};
                    let keys = Object.keys(data);
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        let k = key[0].toLowerCase() + key.substr(1);
                        d[k] = data[key];
                    }
                    data = d;
                }
                this.travelJSON(data);
                return data;
            });
        }
        /**
         * 遍历 JSON 对象各个字段，将日期字符串转换为 Date 对象
         * @param obj 要转换的 JSON 对象
         */
        travelJSON(obj) {
            if (typeof obj === 'string' && this.isDateString(obj)) {
                return new Date(obj);
            }
            else if (typeof obj === 'string') {
                return obj;
            }
            var stack = new Array();
            stack.push(obj);
            while (stack.length > 0) {
                var item = stack.pop();
                for (var key in item) {
                    var value = item[key];
                    if (value == null)
                        continue;
                    if (value instanceof Array) {
                        for (var i = 0; i < value.length; i++) {
                            stack.push(value[i]);
                        }
                        continue;
                    }
                    if (typeof value == 'object') {
                        stack.push(value);
                        continue;
                    }
                    if (typeof value == 'string' && this.isDateString(value)) {
                        item[key] = new Date(value);
                    }
                }
            }
            return obj;
        }
        isDateString(text) {
            const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
            const datePattern1 = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/;
            return text.match(datePattern) != null || text.match(datePattern1) != null;
        }
        getByJson(url, data) {
            if (data && Object.getOwnPropertyNames(data).length > 0)
                url = `${url}?${JSON.stringify(data)}`;
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, method: 'get' });
        }
        putByJson(url, data) {
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, data, method: 'put' });
        }
        postByJson(url, data) {
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, data, method: 'post' });
        }
        deleteByJson(url, data) {
            let headers = { "content-type": 'application/json' };
            return this.ajax(url, { headers, data, method: 'delete' });
        }
        get(url, data) {
            data = data || {};
            let params = "";
            for (let key in data) {
                params = params ? `${params}&${key}=${data[key]}` : `${key}=${data[key]}`;
            }
            if (params) {
                url = `${url}?${params}`;
            }
            return this.ajax(url, { method: 'get' });
        }
        put(url, data) {
            let headers = { "content-type": 'application/x-www-form-urlencoded' };
            return this.ajax(url, { headers, data, method: 'put' });
        }
        post(url, data) {
            let headers = { "content-type": 'application/x-www-form-urlencoded' };
            return this.ajax(url, { headers, data, method: 'post', });
        }
        delete(url, data) {
            let headers = { "content-type": 'application/x-www-form-urlencoded' };
            return this.ajax(url, { headers, data, method: 'delete' });
        }
    }
    exports.default = Service;
});

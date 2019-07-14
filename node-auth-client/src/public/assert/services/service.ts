import { Service as ChiTuSerivce, AjaxOptions, ValueStore } from 'maishu-chitu-service'
import { LoginResult } from 'entities';

export interface LoginInfo extends LoginResult {
    username?: string,
}

export class Service extends ChiTuSerivce {
    static readonly LoginInfoStorageName = 'app-login-info'
    static loginInfo = new ValueStore<LoginInfo | null>(Service.getStorageLoginInfo())
    static applicationId: string | (() => string)

    static getStorageLoginInfo(): LoginInfo | null {
        let loginInfoSerialString = this.getCookie(Service.LoginInfoStorageName)
        if (!loginInfoSerialString)
            return null

        try {
            let loginInfo = JSON.parse(loginInfoSerialString)
            return loginInfo
        }
        catch (e) {
            console.error(e)
            console.log(loginInfoSerialString)
            return null
        }
    }

    protected static setStorageLoginInfo(value: LoginInfo | null) {
        if (value == null) {
            this.removeCookie(Service.LoginInfoStorageName)
            return
        }

        this.setCookie(Service.LoginInfoStorageName, JSON.stringify(value), 1000)
    }

    private static setCookie(name: string, value: string, days?: number) {
        // nodejs 没有 document
        if (typeof document == 'undefined')
            return;

        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    private static getCookie(name: string) {
        if (typeof document == 'undefined')
            return null;

        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    private static removeCookie(name: string) {
        // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.setCookie(name, '')
    }

    async ajax<T>(url: string, options?: AjaxOptions): Promise<T | null> {
        options = options || {}
        options.headers = options.headers || {}
        if (Service.loginInfo.value)
            options.headers['token'] = Service.loginInfo.value.token

        if (Service.applicationId)
            options.headers['application-id'] = typeof Service.applicationId == 'function' ? Service.applicationId() : Service.applicationId

        let data = await super.ajax<T>(url, options)
        if (data == null) {
            return null
        }

        let obj = data as any
        if (obj.code && obj.message) {
            throw new Error(obj.message)
        }

        if (obj != null && obj['DataItems'] != null && obj['TotalRowCount'] != null) {
            let d: any = {};
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let k = (key as string)[0].toLowerCase() + (key as string).substr(1);
                d[k] = obj[key];
            }

            data = d;
        }

        Service.travelJSON(data);
        return data;
    }

    /**
     * 遍历 JSON 对象各个字段，将日期字符串转换为 Date 对象
     * @param obj 要转换的 JSON 对象
     */
    protected static travelJSON(obj: any) {

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

    private static isDateString(text: string): boolean {
        const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const datePattern1 = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/;
        return text.match(datePattern) != null || text.match(datePattern1) != null
    }


}

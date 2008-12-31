import { Service } from "maishu-chitu";
import md5 = require("js-md5");
import { LocalValueStore } from "maishu-chitu-service";
import { errors } from "errors";
import websiteConfig = require("json!websiteConfig");
import { User } from "permission-entities"

export interface LoginInfo {
    token: string;
    userId: string;
}

export class PermissionService extends Service {

    static token = window["token"] = window["token"] || new LocalValueStore<string>("token");

    private url(path: string) {
        return `${location.protocol}//${websiteConfig.gateway}/permission/${path}`;
    }

    async login(username: string, password: string) {
        if (!username) throw errors.argumentNull("username");
        if (!password) throw errors.argumentNull("password");

        password = md5(password);
        let url = this.url("user/login");
        let r = await this.postByJson<LoginInfo>(url, { username, password });
        PermissionService.token.value = r.token;

        return r;
    }

    async me() {
        let url = this.url("user/me");
        let r = await this.get<User>(url);
        return r;
    }
}

// function setCookie(name: string, value: string, days?: number) {
//     // nodejs 没有 document
//     if (typeof document == 'undefined')
//         return;

//     var expires = "";
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }


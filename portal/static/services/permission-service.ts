import { Service } from "maishu-chitu";
import md5 = require("js-md5");
import { CookieValueStore, ValueStore } from "maishu-chitu-service";
// import { gateway } from "../constants";
import { errors } from "errors";
import websiteConfig = require("json!websiteConfig");


export interface LoginInfo {
    token: string;
    userId: string;
}

export class PermissionService extends Service {

    token = new ValueStore<string>("token");

    private url(path: string) {
        return `${location.protocol}//${websiteConfig.gateway}/permission/${path}`;
        //return `${location.protocol}//127.0.0.1:2957/${path}`;
    }

    async login(username: string, password: string) {
        if (!username) throw errors.argumentNull("username");
        if (!password) throw errors.argumentNull("password");

        password = md5(password);
        let url = this.url("user/login");
        let r = await this.postByJson<LoginInfo>(url, { username, password });
        this.token.value = r.token;

        setCookie("token", r.token, 365);
        return r;
    }

    async stationList() {
        let url = `${location.protocol}//${websiteConfig.gateway}/auth/station/list`;
        let r = await this.get<{ path: string }[]>(url);
        return r;
    }


}

function setCookie(name: string, value: string, days?: number) {
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


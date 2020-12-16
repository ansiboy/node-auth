import md5 = require("js-md5");
import { ValueStore, Service } from "maishu-chitu-service";
import { errors } from "../errors";
import { User } from "permission-entities"

export interface LoginInfo {
    token: string;
    userId: string;
}

export class PermissionService extends Service {

    static token: ValueStore<string> = window["token"] = window["token"] || new ValueStore<string>();

    private url(path: string) {
        return `/user/${path}`;
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


function getCookie(name: string) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

PermissionService.token.value = getCookie("token");



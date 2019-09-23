import { Service } from "maishu-chitu";
import { LoginInfo } from "maishu-services-sdk";
import { LocalValueStore, AjaxOptions } from "maishu-chitu-service";
import md5 = require("js-md5");

export class LocalService extends Service {

    loginInfo = new LocalValueStore<LoginInfo>("login-info");

    async login(username: string, password: string) {
        password = md5(password);
        let r = await this.postByJson<LoginInfo>("login", { username, password });
        this.loginInfo.value = r;
        return r;
    }
}
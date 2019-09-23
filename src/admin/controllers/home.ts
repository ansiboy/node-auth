import { controller, action } from "maishu-chitu-admin/node_modules/maishu-node-mvc";
import { PermissionService } from "maishu-services-sdk";
import { routeData, request, response } from "maishu-node-mvc";
import Cookies = require("cookies");
import { constants } from "../../service";

@controller("/")
export class HomeController {
    ps: PermissionService;

    constructor() {
        this.ps = new PermissionService();
    }

    @action()
    async login(@routeData { username, password }, @request req, @response res) {
        let r = await this.ps.user.login(username, password);
debugger
        let cookies = new Cookies(req, res);
        let now = new Date();
        let expires = new Date();
        expires.setFullYear(now.getFullYear() + 1);
        cookies.set(constants.cookieToken, r.token, { expires });

        return r;
    }

    @action()
    async roles() {
        let r = await this.ps.role.list();
        return r;
    }

    @action()
    async me() {
        let user = await this.ps.user.me();
        if (user == null)
            return null;

        return { user_name: user.user_name, user: user.mobile, data: user.data }
    }
}
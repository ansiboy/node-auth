
import { config } from "../config";
import Service from "./service";

let { protocol } = location;

interface Resource {
    id?: string,
    name: string,
    path?: string,
    parent_id: string,
    sort_number: number,
    type: string,
    create_date_time: Date,
}


interface LoginResult {
    token: string
}


export class UserService extends Service {

    static token = new chitu.ValueStore(localStorage['adminToken'] || '');

    url(path: string) {
        return `${protocol}//${config.authServiceHost}/${path}`
    }
    resources() {
        let url = this.url('resource/list')
        let resources = this.get<Resource[]>(url, { type: 'platform' })
        return resources
    }
    async login(username: string, password: string) {
        let url = this.url('user/login')
        let result = await this.postByJson<LoginResult>(url, { username, password })
        UserService.token.value = result.token
    }
    logout() {
        UserService.token.value = ''
    }
    static get isLogin() {
        return (UserService.token.value || '') != ''
    }
}

UserService.token.add((value) => {
    localStorage.setItem("adminToken", value);
});

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
    visible?: boolean
}


interface LoginResult {
    token: string
}


export class UserService extends Service {

    static token = new chitu.ValueStore(localStorage['adminToken'] || '');

    url(path: string) {
        return `${protocol}//${config.authServiceHost}/${path}`
    }
    async resources(): Promise<Resource[]> {
        let url = this.url('resource/list')

        type T = Resource & { data?: { visible?: boolean } }
        let args = { filter: `type = "${config.menuType}"` }
        let result = await this.getByJson<any>(url, { args })
        let resources: T[] = result.dataItems
        for (let i = 0; i < resources.length; i++) {
            let data = resources[i].data
            if (data) {
                delete resources[i].data
                Object.assign(resources[i], data)
            }

        }

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
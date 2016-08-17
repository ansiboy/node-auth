namespace services {
    export class UserService {
        constructor() {

        }
        static login(username: string, password: string): JQueryPromise<any> {
            return $.Deferred().resolve();
        }
    }
}


//export = UserService;
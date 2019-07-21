// import { controller, formData, action, Controller } from "maishu-node-mvc";
// import { UserService, LoginInfo } from "maishu-services-sdk";
// import path = require("path");

// @controller("auth/user")
// export class UserController extends Controller {
//     @action()
//     async login(@formData { username, password }): Promise<LoginInfo> {
//         let us = new UserService();
//         let r = await us.login(username, password);
//         return r;
//     }

//     // @action(
//     //     "/role/list",
//     //     "/role/item",
//     //     "/role/add",
//     //     "/role/remove",

//     //     "user/list",
//     //     "user/update",
//     //     "user/add",

//     //     "token/list",
        
//     //     "/resource/list",
//     // )
//     // async nodeAuthProxy() {
//     //     // let url = path.join("http://127.0.0.1:2857",)
//     //     return this.proxy("http://127.0.0.1:2857")
//     // }
// }
// export enum statusCodes {
//     //=============================================
//     // 成功的状态码，必须大于 200
//     login = 282,
//     logout = 283,
//     //=============================================
//     forbidden = 403,
//     //=============================================
//     // 失败的状态码，必须小于或等于 700
//     argumentNull = 705,

//     /** 字段为空 */
//     fieldNull = 709,

//     /** 用户未登录 */
//     userNotLogin = 718,

//     /** 没有权限 */
//     noPermission = 726,
//     userIdNull = 727,

//     /** 指定 ID 的对象不存在 */
//     objectNotExistWithId = 728,

// }

//=============================================
// 成功的状态码，必须大于 200
// 失败的状态码，必须小于或等于 700
import { StatusCodes } from "maishu-chitu-service";
export let statusCodes = Object.assign(StatusCodes, {
    login: 282,
    logout: 283,
    forbidden: 403,
    // 参数为空
    argumentNull: 705,
    /** 字段为空 */
    fieldNull: 709,
    /** 用户未登录 */
    userNotLogin: 718,
    /** 指定 ID 的对象不存在 */
    objectNotExistWithId: 728,
    /** 没有权限 */
    noPermission: 726,
    userIdNull: 727,
});
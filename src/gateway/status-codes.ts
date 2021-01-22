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


export enum StatusCode {
    Login = 282,
    Logout = 283,
    NotFound = 404,
    OK = 200,
    Redirect = 301,
    BadRequest = 400,
    Forbidden = 403,
    CustomError = 700,
    ArgumentNull = 705,
    /** 字段为空 */
    FieldNull = 709,
    ArgumentTypeIncorrect = 710,
    /** 用户未登录 */
    UserNotLogin = 718,
    /** 没有权限 */
    NoPermission = 726,
    UserIdNull = 727,
    /** 指定 ID 的对象不存在 */
    ObjectNotExistWithId = 728
}
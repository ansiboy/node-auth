import { StatusCodes } from "maishu-chitu-service";
export declare let statusCodes: typeof StatusCodes & {
    login: number;
    logout: number;
    forbidden: number;
    argumentNull: number;
    /** 字段为空 */
    fieldNull: number;
    /** 用户未登录 */
    userNotLogin: number;
    /** 指定 ID 的对象不存在 */
    objectNotExistWithId: number;
    /** 没有权限 */
    noPermission: number;
    userIdNull: number;
};

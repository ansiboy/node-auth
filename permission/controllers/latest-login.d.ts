import { AuthDataContext } from "../data-context";
/** 记录用户最后登录 */
export default class LatestLoginController {
    /**
     * 获取指定用户的登录记录
     * @param d 路由数据
     * @param d.userIds 指定用户的编号
     */
    list(dc: AuthDataContext, d: {
        userIds: string[];
    }): Promise<import("../entities").UserLatestLogin[]>;
}

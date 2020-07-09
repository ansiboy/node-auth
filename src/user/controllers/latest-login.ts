import { controller, action, routeData } from "maishu-node-mvc";
import { UserDataContext, permissionDataContext } from "../data-context";

/** 记录用户最后登录 */
@controller("latest-login")
export default class LatestLoginController {

    /** 
     * 获取指定用户的登录记录
     * @param d 路由数据
     * @param d.userIds 指定用户的编号
     */
    @action()
    async list(@permissionDataContext dc: UserDataContext, @routeData d: { userIds: string[] }) {
        let items = await dc.userLatestLogins.createQueryBuilder()
            .whereInIds(d.userIds).getMany();

        return items;
    }
}
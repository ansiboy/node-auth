import { controller, action, routeData } from "maishu-node-mvc";
import { AuthDataContext } from "../data-context";
import { authDataContext } from "../decorators";

@controller("latest-login")
export default class LatestLoginController {
    @action()
    async list(@authDataContext dc: AuthDataContext, @routeData { userIds }: { userIds: string[] }) {
        let items = await dc.userLatestLogins.createQueryBuilder()
            .whereInIds(userIds).getMany();

        return items;
    }
}
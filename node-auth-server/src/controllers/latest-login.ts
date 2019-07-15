import { controller, action, formData } from "maishu-node-mvc";
import { AuthDataContext } from "../dataContext";
import { authDataContext } from "../decorators";

@controller("latest-login")
export default class LatestLoginController {
    @action()
    async list(@authDataContext dc: AuthDataContext, @formData { userIds }: { userIds: string[] }) {
        let items = await dc.userLatestLogins.createQueryBuilder()
            .whereInIds(userIds).getMany();

        return items;
    }
}
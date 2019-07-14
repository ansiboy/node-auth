import { AuthDataContext } from "../dataContext";
export default class LatestLoginController {
    list(dc: AuthDataContext, { userIds }: {
        userIds: string[];
    }): Promise<import("../entities").UserLatestLogin[]>;
}

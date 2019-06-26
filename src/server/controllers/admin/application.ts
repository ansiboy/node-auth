import { Controller, controller, action } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../../dataContext";

@controller("admin/application")
export default class ApplicationController extends Controller {
    @action()
    async list(@authDataContext dc: AuthDataContext) {
        let items = await dc.applications.createQueryBuilder("a").orderBy("a.createDateTime", "DESC").getMany();
        return items;
    }
}
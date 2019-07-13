import { controller, action } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../dataContext";
import { Category } from "../entities";
import { constants } from "../common";

@controller(`${constants.controllerBasePath}/category`)
export class CategoryController {
    @action()
    async list(@authDataContext dc: AuthDataContext): Promise<Category[]> {
        let r = await dc.categories.find();
        return r;
    }
}
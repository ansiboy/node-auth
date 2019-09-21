import { controller, action } from "maishu-node-mvc";
import { AuthDataContext } from "../data-context";
import { Category } from "../entities";
import { constants } from "../common";
import { authDataContext } from "../decorators";

@controller(`${constants.controllerBasePath}/category`)
export class CategoryController {
    @action()
    async list(@authDataContext dc: AuthDataContext): Promise<Category[]> {
        let r = await dc.categories.find();
        return r;
    }
}
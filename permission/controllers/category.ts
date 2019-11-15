import { controller, action } from "maishu-node-mvc";
import { AuthDataContext, authDataContext } from "../data-context";
import { Category } from "../entities";
import { controllerPathRoot } from "../config";

@controller(`${controllerPathRoot}/category`)
export class CategoryController {
    @action()
    async list(@authDataContext dc: AuthDataContext): Promise<Category[]> {
        let r = await dc.categories.find();
        return r;
    }
}
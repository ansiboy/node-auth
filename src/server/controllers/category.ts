import { controller, action } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../dataContext";
import { Category } from "../entities";

@controller("category")
export class CategoryController {
    @action()
    async list(@authDataContext dc: AuthDataContext): Promise<Category[]> {
        let r = await dc.categories.find();
        return r;
    }
}
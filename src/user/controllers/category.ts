import { controller, action } from "maishu-node-mvc";
import { UserDataContext } from "../data-context";
import { Category } from "../entities";
import { controllerPathRoot } from "../config";
import { userDataContext } from "../decorators";

@controller(`${controllerPathRoot}/category`)
export class CategoryController {
    @action()
    async list(@userDataContext dc: UserDataContext): Promise<Category[]> {
        let r = await dc.categories.find();
        return r;
    }
}
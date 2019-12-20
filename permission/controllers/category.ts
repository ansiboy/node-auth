import { controller, action } from "maishu-node-mvc";
import { PermissionDataContext, permissionDataContext } from "../data-context";
import { Category } from "../entities";
import { controllerPathRoot } from "../config";

@controller(`${controllerPathRoot}/category`)
export class CategoryController {
    @action()
    async list(@permissionDataContext dc: PermissionDataContext): Promise<Category[]> {
        let r = await dc.categories.find();
        return r;
    }
}
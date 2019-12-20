import { PermissionDataContext } from "../data-context";
import { Category } from "../entities";
export declare class CategoryController {
    list(dc: PermissionDataContext): Promise<Category[]>;
}

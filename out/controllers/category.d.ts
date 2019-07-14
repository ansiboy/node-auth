import { AuthDataContext } from "../dataContext";
import { Category } from "../entities";
export declare class CategoryController {
    list(dc: AuthDataContext): Promise<Category[]>;
}

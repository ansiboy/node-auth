import { Controller } from "maishu-node-mvc";
import { AuthDataContext } from "../dataContext";
export declare class ResourcePathController extends Controller {
    list(dc: AuthDataContext): Promise<import("../entities").ResourcePath[]>;
}

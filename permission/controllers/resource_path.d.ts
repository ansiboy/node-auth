import { Controller } from "maishu-node-mvc";
import { PermissionDataContext } from "../data-context";
export declare class ResourcePathController extends Controller {
    list(dc: PermissionDataContext): Promise<import("../entities").ResourcePath[]>;
}

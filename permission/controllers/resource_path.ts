import { Controller, action } from "maishu-node-mvc";
import { PermissionDataContext, permissionDataContext } from "../data-context";

export class ResourcePathController extends Controller {
    @action()
    async list(@permissionDataContext dc: PermissionDataContext) {
        let r = await dc.resourcePaths.find();
        return r;
    }
}
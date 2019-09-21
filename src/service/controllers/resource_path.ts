import { Controller, action } from "maishu-node-mvc";
import { actionPaths } from "../common";
import { authDataContext } from "../decorators";
import { AuthDataContext } from "../data-context";

export class ResourcePathController extends Controller {
    @action(actionPaths.resource_path.list)
    async list(@authDataContext dc: AuthDataContext) {
        let r = await dc.resourcePaths.find();
        return r;
    }
}
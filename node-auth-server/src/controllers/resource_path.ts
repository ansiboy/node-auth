import { Controller, action } from "maishu-node-mvc";
import { actionPaths } from "../common";
import { authDataContext } from "../decorators";
import { AuthDataContext } from "../dataContext";

export class ResourcePathController extends Controller {
    @action(actionPaths.resource_path.list)
    async list(@authDataContext dc: AuthDataContext) {
        let r = await dc.resourcePath.find();
        return r;
    }
}
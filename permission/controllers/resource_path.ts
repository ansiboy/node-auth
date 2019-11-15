import { Controller, action } from "maishu-node-mvc";
import { AuthDataContext, authDataContext } from "../data-context";

export class ResourcePathController extends Controller {
    @action()
    async list(@authDataContext dc: AuthDataContext) {
        let r = await dc.resourcePaths.find();
        return r;
    }
}
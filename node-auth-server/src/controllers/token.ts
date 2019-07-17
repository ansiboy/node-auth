import { controller, action, formData } from "maishu-node-mvc";
import { AuthDataContext } from "../data-context";
import { SelectArguments, BaseController } from "./base-controller";
import { actionPaths } from "../common";
import { authDataContext } from "../decorators";

@controller("token")
export default class TokenController extends BaseController {
    @action(actionPaths.token.list)
    list(@authDataContext dc: AuthDataContext, @formData { args }: { args: SelectArguments }) {
        return BaseController.list(dc.tokens, { selectArguments: args })
    }


}
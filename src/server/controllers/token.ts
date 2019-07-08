import { controller, action } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../dataContext";
import { SelectArguments, BaseController } from "./base-controller";
import { actionPaths } from "../common";

@controller("token")
export default class TokenController extends BaseController {
    @action(actionPaths.token.list)
    list(@authDataContext dc: AuthDataContext, args: SelectArguments) {
        return BaseController.list(dc.tokens, args)
    }


}
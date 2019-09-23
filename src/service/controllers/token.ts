import { controller, action, routeData } from "maishu-node-mvc";
import { AuthDataContext } from "../data-context";
import { SelectArguments, BaseController } from "./base-controller";
import { actionPaths } from "../common";
import { authDataContext } from "../decorators";
import { Token } from "../entities";

@controller("token")
export default class TokenController extends BaseController {
    @action(actionPaths.token.list)
    list(@authDataContext dc: AuthDataContext, @routeData { args }: { args: SelectArguments }) {
        return BaseController.list<Token>(dc.tokens, { selectArguments: args })
    }


}
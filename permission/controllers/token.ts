import { controller, action, routeData } from "maishu-node-mvc";
import { AuthDataContext, authDataContext } from "../data-context";
import { SelectArguments, BaseController } from "./base-controller";
import { Token } from "../entities";

@controller("token")
export default class TokenController extends BaseController {
    @action()
    list(@authDataContext dc: AuthDataContext, @routeData { args }: { args: SelectArguments }) {
        return BaseController.list<Token>(dc.tokens, { selectArguments: args })
    }


}
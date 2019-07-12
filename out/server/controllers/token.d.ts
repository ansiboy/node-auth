import { AuthDataContext } from "../dataContext";
import { SelectArguments, BaseController } from "./base-controller";
export default class TokenController extends BaseController {
    list(dc: AuthDataContext, { args }: {
        args: SelectArguments;
    }): Promise<import("maishu-mysql-helper").SelectResult<import("../entities").Token>>;
}

import { AuthDataContext } from "../dataContext";
import { SelectArguments, BaseController } from "./base-controller";
export default class TokenController extends BaseController {
    list(dc: AuthDataContext, { args }: {
        args: SelectArguments;
    }): Promise<import("./base-controller").SelectResult<import("../entities").Token>>;
}

import { PermissionDataContext } from "../data-context";
import { SelectArguments, BaseController } from "./base-controller";
export default class TokenController extends BaseController {
    list(dc: PermissionDataContext, { args }: {
        args: SelectArguments;
    }): Promise<import("./base-controller").SelectResult<any>>;
}

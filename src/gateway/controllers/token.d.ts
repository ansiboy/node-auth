import { AuthDataContext, SelectArguments } from "../data-context";
export declare class TokenController {
    list(dc: AuthDataContext, { args }: {
        args: SelectArguments;
    }): Promise<import("../data-context").SelectResult<import("../entities").TokenData>>;
}

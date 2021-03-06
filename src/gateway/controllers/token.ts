import { controller, routeData, action } from "maishu-node-mvc";
import { constants } from "../global";
import { AuthDataContext, authDataContext, SelectArguments } from "../data-context";
import { errors } from "../errors";
import { DataHelper } from "maishu-node-data";

@controller(`/${constants.controllerPathRoot}/token`)
export class TokenController {
    @action()
    list(@authDataContext dc: AuthDataContext, @routeData { args }: { args: SelectArguments }) {
        if (!args) throw errors.routeDataFieldNull("args");

        let r = DataHelper.list(dc.tokenDatas, { selectArguments: args });
        return r;
    }
}
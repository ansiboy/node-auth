import { controller, routeData, action } from "maishu-node-mvc";
import { constants } from "../../global";
import { AuthDataContext } from "../../data-context";
import { errors } from "../../errors";
import { DataHelper, SelectArguments } from "maishu-node-data";
import { authDataContext } from "../../decorators";

@controller(`${constants.adminApiBasePath}/token`)
export class TokenController {
    @action()
    list(@authDataContext dc: AuthDataContext, @routeData { args }: { args: SelectArguments }) {
        if (!args) throw errors.routeDataFieldNull("args");

        let r = DataHelper.list(dc.tokenDatas, { selectArguments: args });
        return r;
    }
}
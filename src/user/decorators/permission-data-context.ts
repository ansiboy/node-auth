import { tokenDataHeaderNames } from "../../gateway";
import { createParameterDecorator } from "maishu-node-mvc";
// import { settings } from "../global";
import { errors } from "../errors";
import { DataHelper } from "maishu-node-data";
import { UserDataContext } from "../data-context";
import { ServerContextData } from "user/types";

export let userDataContext = createParameterDecorator<UserDataContext>(
    async (ctx) => {
        console.assert(ctx.data != null);
        let dc = await DataHelper.createDataContext(UserDataContext, (ctx.data as ServerContextData).db);
        return dc
    },
    async () => {
    }
)

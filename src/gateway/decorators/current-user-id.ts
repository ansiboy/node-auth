import { AuthDataContext } from "../data-context";
import { createParameterDecorator } from "maishu-node-mvc";
import { DataHelper } from "maishu-node-data";
import { g, roleIds, userIds } from "../global";
import { getTokenData } from "../filters/authenticate";

export let currentUserId = createParameterDecorator(async (context) => {
    let { req, res } = context;
    let tokenData = await getTokenData(req, res);
    if (!tokenData) {
        tokenData = await getTokenData(req, res);
        return null;
    }

    return tokenData.user_id;
})
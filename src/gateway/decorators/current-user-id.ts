import { createParameterDecorator } from "maishu-node-mvc";
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
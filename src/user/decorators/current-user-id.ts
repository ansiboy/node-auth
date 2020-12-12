import { tokenDataHeaderNames } from "../../gateway";
import { createParameterDecorator } from "maishu-node-mvc";
import { errors } from "../errors";

export let currentUserId = createParameterDecorator(async (context) => {

    let userId = context.req.headers[tokenDataHeaderNames.userId];

    if (userId == null)
        throw errors.canntGetUserIdFromHeader();

    return userId;
})
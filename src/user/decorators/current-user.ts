import { tokenDataHeaderNames } from "../../gateway";
import { createParameterDecorator } from "maishu-node-mvc";
import { settings } from "../global";
import { errors } from "../errors";
import { DataHelper } from "maishu-node-data";
import { UserDataContext } from "../data-context";

export let currentUser = createParameterDecorator(async (context) => {
    let userId = context.req.headers[tokenDataHeaderNames.userId] as string;
    if (!userId)
        return null;

    let dc = await DataHelper.createDataContext(UserDataContext, settings.db); //createDataContext(settings.db);
    let user = await dc.users.findOne(userId);

    if (!user)
        throw errors.objectNotExistWithId(userId, "User");

    return user;
})

export let currentUserId = createParameterDecorator(async (context) => {

    let userId = context.req.headers[tokenDataHeaderNames.userId] as string;
    return userId;

});

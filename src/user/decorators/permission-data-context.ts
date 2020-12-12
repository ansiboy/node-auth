import { tokenDataHeaderNames } from "../../gateway";
import { createParameterDecorator } from "maishu-node-mvc";
import { settings } from "../global";
import { errors } from "../errors";
import { DataHelper } from "maishu-node-data";
import { UserDataContext } from "../data-context";

export let permissionDataContext = createParameterDecorator<UserDataContext>(
    async () => {
        console.assert(settings.db != null);
        let dc = await DataHelper.createDataContext(UserDataContext, settings.db);
        return dc
    },
    async () => {
    }
)

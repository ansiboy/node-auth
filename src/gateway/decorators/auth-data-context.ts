import { AuthDataContext } from "../data-context";
import { createParameterDecorator } from "maishu-node-mvc";
import { DataHelper } from "maishu-node-data";
import { g } from "../global";

export let authDataContext = createParameterDecorator<AuthDataContext>(
    async () => {
        console.assert(g.settings.db != null);
        let dc = AuthDataContext.create(g.settings.db);//await AuthDataContext.create(g.settings.db);
        return dc
    }
)

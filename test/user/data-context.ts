import { UserDataContext } from "../../out/user/data-context";
// import config from "../../out/config";
import * as assert from "assert";
import { DataHelper } from "maishu-node-data";
import { Config, loadConfig } from "../../out/config";

describe("user data context", function () {
    it("users", async function () {
        let config = await loadConfig();
        let dc = await DataHelper.createDataContext(UserDataContext, config.db.user);
        // let dc = await new User(config.db.permission);
        let items = await dc.users.find({ take: 10 });
        assert.ok(items instanceof Array);
    })
})
import { UserDataContext, createDataContext } from "../../out/user/data-context";
import config from "../../out/config";
import * as assert from "assert";

describe("user data context", function () {
    it("users", async function () {
        let dc = await createDataContext(config.db.permission);
        let items = await dc.users.find({ take: 10 });
        assert.ok(items instanceof Array);
    })
})
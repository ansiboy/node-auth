import { AuthDataContext, createDataContext } from "../../out/gateway/data-context";
import config from "../../out/config";
import * as assert from "assert";
describe("gateway data context", function () {
    it("menuItemRecords", async function () {
        let dc = await createDataContext(config.db.gateway);
        let items = await dc.menuItemRecords.find();
        assert.ok(items instanceof Array);
    })
    it("roles", async function () {
        let dc = await createDataContext(config.db.gateway);
        let items = await dc.roles.find();
        assert(items instanceof Array);
    })
    it("tokenDatas", async function () {
        let dc = await createDataContext(config.db.gateway);
        let items = await dc.tokenDatas.find();
        assert(items instanceof Array);
    })
    it("userRoles", async function () {
        let dc = await createDataContext(config.db.gateway);
        let items = await dc.userRoles.find();
        assert(items instanceof Array);
    })
})
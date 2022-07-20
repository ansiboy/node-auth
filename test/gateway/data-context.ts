import { AuthDataContext } from "../../out/gateway/data-context";
import { loadConfig } from "../../out/config";
import * as assert from "assert";
import { DataHelper } from "maishu-node-data";

describe("gateway data context", function () {
    describe("", async function () {
        let config = await loadConfig();
        let dc = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);
        it("menuItemRecords", async function () {
            let items = await dc.menuItemRecords.find();
            assert.ok(items instanceof Array);
        })
        it("roles", async function () {
            let items = await dc.roles.find();
            assert(items instanceof Array);
        })
        it("tokenDatas", async function () {
            let items = await dc.tokenDatas.find();
            assert(items instanceof Array);
        })
        it("userRoles", async function () {
            let items = await dc.userRoles.find();
            assert(items instanceof Array);
        })
    })
})
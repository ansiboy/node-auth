import { DataHelper } from "maishu-node-data";
import { loadConfig } from "../../out/config";
import ApplicationController from "../../out/gateway/controllers/platform/app";
import { AuthDataContext } from "../../out/gateway/data-context";
import * as assert from "assert";
import { Application } from "../../out/gateway/entities";
import { guid } from "maishu-toolkit";

describe("application controller", function () {

    const gemwonAppId = '7bbfa36c-8115-47ad-8d47-9e52b58e7efd';

    it("delete", async function () {
        let config = await loadConfig();
        let controller = new ApplicationController()
        let dc = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);

        let itemId = guid();
        let item: Partial<Application> = {
            id: itemId, name: "test", domains: ["test.com"], createDateTime: new Date()
        }

        await dc.apps.insert(item);

        let item1 = await dc.apps.findOne(itemId);
        assert.notEqual(item1, null);

        let r = await controller.delete(dc, { id: itemId });
        assert.notEqual(r, null);

        let item2 = await dc.apps.findOne(itemId);
        assert.equal(item2, null);
    })

    it("list", async function () {

        let config = await loadConfig();
        let controller = new ApplicationController()
        let dc = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);


        let items = await controller.list(dc, { args: { startRowIndex: 0, maximumRows: 10 } })

    })

    it("insert", async function () {

        let config = await loadConfig();
        let controller = new ApplicationController()
        let dc = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);

        let itemId = guid();
        let item: Partial<Application> = {
            id: itemId, name: "test", domains: ["test.com"], createDateTime: new Date()
        }

        // await controller.delete(dc, { id: gemwonAppId });
        let r = await controller.insert(dc, { item });
        assert.notEqual(r, null);



    })

    it("update", async function () {

        let config = await loadConfig();
        let controller = new ApplicationController()
        let dc = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);

        let item: Partial<Application> = {
            id: guid(), name: "test", domains: [], createDateTime: new Date()
        }

        await dc.apps.insert(item);
        await controller.update(dc, { item: { id: item.id, domains: ["gemwon.com"], name: "test1" } });

        let item1 = await dc.apps.findOne(item.id);
        assert.notEqual(item1, null);
        assert.equal(item1?.name, "test1");
        assert.notEqual(item1?.domains, null);
        assert.equal(item1?.domains[0], "gemwon.com");

        await dc.apps.delete(item.id as string);

    })

    it("item", async function () {

        let config = await loadConfig();
        let controller = new ApplicationController()
        let dc = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);
        let itemId = guid();
        let item: Partial<Application> = {
            id: itemId, name: "test", domains: [], createDateTime: new Date()
        }

        await dc.apps.insert(item);


        let item1 = await controller.item(dc, { id: itemId });
        assert.notEqual(item1, null);
        assert.equal(item1.id, item.id);
        assert.equal(item1.name, item.name);

        await dc.apps.delete(itemId);

    })
})



import { start } from "../out/gateway";

describe("authenticate", function () {
    it("auth", function () {
        let r = start({
            db: {
                type: "mysql",
                username: "root",
                password: "81263",
                database: "node_auth_gateway",
                host: "localhost",
                port: 3306
            }
        })
    })
})
const { getDataContext, initDatabase } = require("../out/data-context");
const { setConnection } = require("../out/settings")

setConnection({
    host: "127.0.0.1", database: "shop_auth",
    user: "root", password: "81263"
})

async function main() {
    let dc = await getDataContext();
    initDatabase(dc);
}

main();
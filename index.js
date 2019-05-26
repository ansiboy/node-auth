const { startServer } = require('maishu-node-mvc')
const config = require('./config.json')
startServer({
    port: config.port,
    db: {

    }
})
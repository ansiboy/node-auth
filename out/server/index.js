"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
const path = require("path");
const settings_1 = require("./settings");
function start(options) {
    maishu_node_mvc_1.startServer({
        port: options.port, rootPath: __dirname,
        controllerDirectory: path.join(__dirname, 'controllers'),
        staticRootDirectory: path.join(__dirname, '../../src/client'),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
    });
    settings_1.setConnection(options.db);
}
exports.start = start;
//# sourceMappingURL=index.js.map
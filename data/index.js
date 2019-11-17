"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_context_1 = require("./data-context");
var data_context_2 = require("./data-context");
exports.DataContext = data_context_2.DataContext;
let db = new data_context_1.DataContext({
    database: "node-auth-gateway",
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "81263"
});

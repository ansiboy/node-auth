"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
const path = require("path");
const settings_1 = require("./settings");
const dataContext_1 = require("./dataContext");
const checkPath_1 = require("./filters/checkPath");
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        settings_1.setConnection(options.db);
        yield dataContext_1.initDatabase();
        maishu_node_mvc_1.startServer({
            port: options.port, rootPath: __dirname,
            controllerDirectory: path.join(__dirname, 'controllers'),
            staticRootDirectory: path.join(__dirname, '../../out/client'),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
            actionFilters: [
                checkPath_1.checkPath
            ]
        });
    });
}
exports.start = start;
//# sourceMappingURL=index.js.map
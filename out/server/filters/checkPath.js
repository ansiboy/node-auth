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
const url = require("url");
const maishu_node_mvc_1 = require("maishu-node-mvc");
const dataContext_1 = require("../dataContext");
const errors_1 = require("../errors");
let resourcePaths;
/**
 * 检查路径是否允许访问
 */
function checkPath(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!resourcePaths) {
            let dc = yield dataContext_1.createDataContext();
            resourcePaths = yield dc.paths.find();
        }
        let u = url.parse(req.url);
        let r = resourcePaths.filter(o => o.value == u.pathname);
        if (r.length > 0) {
            return null;
        }
        return null;
        let error = new Error(`Has none permission to visit path '${u.pathname}'`);
        error.name = errors_1.errorNames.noPermission;
        let result = new maishu_node_mvc_1.ContentResult("{}", "application/json; charset=utf-8", errors_1.errorStatusCodes.noPermission);
        console.warn(error);
        return result;
    });
}
exports.checkPath = checkPath;
//# sourceMappingURL=checkPath.js.map
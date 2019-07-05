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
class BaseController extends maishu_node_mvc_1.Controller {
    static list(r, args, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            let order;
            if (args.sortExpression) {
                let arr = args.sortExpression.split(/\s+/).filter(o => o);
                console.assert(arr.length > 0);
                order = {};
                order[arr[0]] = arr[1].toUpperCase();
            }
            let [items, count] = yield r.findAndCount({
                where: args.filter, relations,
                skip: args.startRowIndex,
                take: args.maximumRows,
                order: order
            });
            return { dataItems: items, totalRowCount: count };
        });
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base-controller.js.map
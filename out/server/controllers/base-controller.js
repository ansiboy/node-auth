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
    static list(r, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || {};
            let q = r.createQueryBuilder();
            if (args.filter) {
                q = q.where(args.filter);
            }
            if (args.sortExpression) {
                let arr = args.sortExpression.split(/\s+/).filter(o => o);
                console.assert(arr.length > 0);
                q.orderBy(arr[0], arr[1].toUpperCase());
            }
            if (args.maximumRows) {
                q = q.take(args.maximumRows);
            }
            if (args.startRowIndex) {
                q = q.skip(args.startRowIndex);
            }
            let items = yield q.getMany();
            let count = yield q.getCount();
            return { dataItems: items, totalRowCount: count };
        });
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base-controller.js.map
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
const db = require("maishu-mysql-helper");
function action() {
    return function (target, propertyKey, descriptor) {
        let method = descriptor.value;
        descriptor.value = function (args, req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                if (args.conn == null) {
                    let application_id = args['application-id'];
                    if (application_id == null && req != null) {
                        application_id = req.headers['application-id'];
                    }
                    // if (!application_id)
                    //     throw errors.parameterRequired('application-id')
                    args.conn = yield db.getConnection(application_id);
                }
                if (args.conn == null)
                    throw errors.getConnectionFail();
                let p = method.apply(this, [args, req, res]);
                if (p.then == null || p.catch == null) {
                    args.conn.end();
                    throw errors.actionResultNotPromise(propertyKey);
                }
                console.assert(args.conn != null, 'conn is null');
                p.then(o => {
                    args.conn.end();
                    return o;
                }).catch(o => {
                    console.log(o);
                    console.assert(args.conn != null);
                    args.conn.end();
                    return o;
                });
                return p;
            });
        };
    };
}
exports.action = action;
class Errors {
    getConnectionFail() {
        let error = new Error('Get connection fail');
        return error;
    }
    actionResultNotPromise(actionName) {
        let error = new Error(`Action '${actionName}' result is not a promise.`);
        return error;
    }
    arugmentNull(name) {
        let error = new Error(`Argument ${name} cannt null or empty.`);
        return error;
    }
    billDetailNotExists(productId) {
        let error = new Error(`Bill detail with product id ${productId} is not exists.`);
        return error;
    }
    parameterRequired(name) {
        let error = new Error(`Parameter '${name}' is required.`);
        error.name = Errors.prototype.parameterRequired.name;
        return error;
    }
}
let errors = new Errors;
//# sourceMappingURL=controller.js.map
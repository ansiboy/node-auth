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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const maishu_node_mvc_1 = require("maishu-node-mvc");
const settings_1 = require("./settings");
const entities_1 = require("./entities");
const path = require("path");
class AuthDataContext {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository(entities_1.Role);
        this.applications = this.entityManager.getRepository(entities_1.Application);
        this.categories = this.entityManager.getRepository(entities_1.Category);
        this.resources = this.entityManager.getRepository(entities_1.Resource);
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.entityManager.connection.close();
        });
    }
}
exports.AuthDataContext = AuthDataContext;
exports.authDataContext = maishu_node_mvc_1.createParameterDecorator(() => __awaiter(this, void 0, void 0, function* () {
    // if (!zxgtDataContextInstance)
    let dc = yield createDataContext();
    return dc;
}), (dc) => __awaiter(this, void 0, void 0, function* () {
    yield dc.dispose();
}));
function createDataContext() {
    return __awaiter(this, void 0, void 0, function* () {
        let c = yield typeorm_1.createConnection({
            type: "mysql",
            host: settings_1.conn.auth.host,
            port: settings_1.conn.auth.port,
            username: settings_1.conn.auth.username,
            password: settings_1.conn.auth.password,
            database: settings_1.conn.auth.database,
            synchronize: false,
            logging: false,
            entities: [
                path.join(__dirname, "entities.js")
            ]
        });
        let dc = new AuthDataContext(c.manager);
        return dc;
    });
}
exports.createDataContext = createDataContext;
//# sourceMappingURL=dataContext.js.map
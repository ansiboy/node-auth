"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const dataContext_1 = require("../dataContext");
const common_1 = require("../common");
const decorators_1 = require("../decorators");
let PathController = class PathController {
    list(dc, { resourceId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let items;
            if (resourceId) {
                let resourcePaths = yield dc.resourcePath.find({ resource_id: resourceId });
                items = yield dc.paths.findByIds(resourcePaths.map(o => o.path_id));
            }
            else {
                items = yield dc.paths.find();
            }
            return items;
        });
    }
    listByResourceIds(dc, { resourceIds }) {
        return __awaiter(this, void 0, void 0, function* () {
            let resourcePaths = yield dc.resourcePath.createQueryBuilder()
                .where(`resource_id in (...:resourceIds)`).setParameters({ resourceIds })
                .getMany();
            let pathIds = resourcePaths.map(o => o.path_id);
            let paths = yield dc.paths.findByIds(pathIds);
            return paths;
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.path.list),
    __param(0, decorators_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], PathController.prototype, "list", null);
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.path.listByResourceIds),
    __param(0, decorators_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], PathController.prototype, "listByResourceIds", null);
PathController = __decorate([
    maishu_node_mvc_1.controller("path")
], PathController);
exports.PathController = PathController;
//# sourceMappingURL=path.js.map
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
const errors_1 = require("../errors");
const database_1 = require("../database");
const common_1 = require("../common");
let PathController = class PathController {
    list(dc, { resourceId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let items;
            if (resourceId) {
                items = yield dc.paths.find({ resource_id: resourceId });
            }
            else {
                items = yield dc.paths.find();
            }
            return items;
        });
    }
    add(dc, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.argumentNull("item");
            item.id = database_1.guid();
            item.create_date_time = new Date(Date.now());
            yield dc.paths.save(item);
            return { id: item.id, create_date_time: item.create_date_time };
        });
    }
    update(dc, { item }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                throw errors_1.errors.argumentNull("item");
            if (!item.id)
                throw errors_1.errors.argumentFieldNull("id", "item");
            if (!item.value)
                throw errors_1.errors.argumentFieldNull("value", "item");
            let entity = yield dc.paths.findOne({ id: item.id });
            if (!entity)
                throw errors_1.errors.objectNotExistWithId(item.id, "path");
            entity.value = item.value;
            yield dc.paths.save(item);
            return { id: item.id, create_date_time: item.create_date_time };
        });
    }
    remove(dc, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentFieldNull("id", "formData");
            yield dc.paths.delete({ id });
            return { id };
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(common_1.actionPaths.path.list),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], PathController.prototype, "list", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], PathController.prototype, "add", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], PathController.prototype, "update", null);
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext), __param(1, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", Promise)
], PathController.prototype, "remove", null);
PathController = __decorate([
    maishu_node_mvc_1.controller("path")
], PathController);
exports.PathController = PathController;
//# sourceMappingURL=path.js.map
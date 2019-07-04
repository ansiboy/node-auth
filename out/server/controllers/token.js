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
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
const dataContext_1 = require("../dataContext");
const base_controller_1 = require("./base-controller");
let TokenController = class TokenController extends base_controller_1.BaseController {
    list(dc, args) {
        return base_controller_1.BaseController.list(dc.tokens, args);
    }
};
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, dataContext_1.authDataContext),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, Object]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "list", null);
TokenController = __decorate([
    maishu_node_mvc_1.controller("token")
], TokenController);
exports.default = TokenController;
//# sourceMappingURL=token.js.map
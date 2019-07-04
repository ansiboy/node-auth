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
const decorators_1 = require("../decorators");
const errors_1 = require("../errors");
let CurrentUserController = class CurrentUserController {
    resourceList(dc, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw errors_1.errors.argumentNull("userId");
            let user = yield dc.users.findOne(userId, { relations: ["roles"] });
            let roleIds = user.roles.map(o => o.id);
            let roles = yield dc.roles.find({
                relations: ['resources'],
                where: dc.roles.createQueryBuilder().where("id in (...:roleIds)").setParameter("roleIds", roleIds),
            });
            let r = [];
            roles.forEach(role => r.push(...role.resources));
            return r;
        });
    }
};
__decorate([
    maishu_node_mvc_1.action("resource/list"),
    __param(0, dataContext_1.authDataContext), __param(1, decorators_1.UserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dataContext_1.AuthDataContext, String]),
    __metadata("design:returntype", Promise)
], CurrentUserController.prototype, "resourceList", null);
CurrentUserController = __decorate([
    maishu_node_mvc_1.controller("current-user")
], CurrentUserController);
exports.default = CurrentUserController;
//# sourceMappingURL=current-user.js.map
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
const user_variable_1 = require("../user-variable");
const database_1 = require("../database");
const mysql = require("mysql");
const errors_1 = require("../errors");
let UserApplicationController = class UserApplicationController {
    remove(conn, userId, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw errors_1.errors.argumentNull('id');
            // return connect(conn => {
            let sql = `delete from application where id = ? and user_id = ?`;
            return database_1.execute(conn, sql, [id, userId]);
            // })
        });
    }
};
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, database_1.connection), __param(1, user_variable_1.userVariable('user-id')), __param(2, maishu_node_mvc_1.formData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserApplicationController.prototype, "remove", null);
UserApplicationController = __decorate([
    maishu_node_mvc_1.controller('/user/application')
], UserApplicationController);
exports.UserApplicationController = UserApplicationController;
//# sourceMappingURL=user-application.js.map
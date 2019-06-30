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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Role = class Role {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Role.prototype, "remark", void 0);
__decorate([
    typeorm_1.Column({ type: "json" }),
    __metadata("design:type", Object)
], Role.prototype, "data", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Role.prototype, "category", void 0);
__decorate([
    typeorm_1.Column({ name: "create_date_time" }),
    __metadata("design:type", Date)
], Role.prototype, "create_date_time", void 0);
__decorate([
    typeorm_1.Column({ name: "application_id" }),
    __metadata("design:type", String)
], Role.prototype, "application_id", void 0);
Role = __decorate([
    typeorm_1.Entity("role")
], Role);
exports.Role = Role;
let Application = class Application {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "json" }),
    __metadata("design:type", Object)
], Application.prototype, "data", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Application.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: "user_id" }),
    __metadata("design:type", String)
], Application.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column({ name: "create_date_time" }),
    __metadata("design:type", Date)
], Application.prototype, "create_date_time", void 0);
Application = __decorate([
    typeorm_1.Entity("application")
], Application);
exports.Application = Application;
let Category = class Category {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "code", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Category.prototype, "create_date_time", void 0);
Category = __decorate([
    typeorm_1.Entity("category")
], Category);
exports.Category = Category;
let Resource = class Resource {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Resource.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "path", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "parent_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Resource.prototype, "sort_number", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Resource.prototype, "create_date_time", void 0);
__decorate([
    typeorm_1.Column({ type: "json" }),
    __metadata("design:type", Object)
], Resource.prototype, "data", void 0);
Resource = __decorate([
    typeorm_1.Entity("resource")
], Resource);
exports.Resource = Resource;
//# sourceMappingURL=entities.js.map
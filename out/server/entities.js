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
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 200, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "remark", void 0);
__decorate([
    typeorm_1.Column({ type: "json", nullable: true, }),
    __metadata("design:type", Object)
], Role.prototype, "data", void 0);
__decorate([
    typeorm_1.Column({ name: "create_date_time" }),
    __metadata("design:type", Date)
], Role.prototype, "create_date_time", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Resource),
    typeorm_1.JoinTable({
        name: "role_resource",
        joinColumns: [{ name: "role_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "resource_id", referencedColumnName: "id" }]
    }),
    __metadata("design:type", Array)
], Role.prototype, "resources", void 0);
__decorate([
    typeorm_1.Column({ type: "bit", default: false }),
    __metadata("design:type", Boolean)
], Role.prototype, "is_system", void 0);
__decorate([
    typeorm_1.Column({ type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "role_id", void 0);
__decorate([
    typeorm_1.Column({ type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "parent_id", void 0);
Role = __decorate([
    typeorm_1.Entity("role")
], Role);
exports.Role = Role;
let Category = class Category {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", String)
], Category.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", Date)
], Category.prototype, "create_date_time", void 0);
Category = __decorate([
    typeorm_1.Entity("category")
], Category);
exports.Category = Category;
let Resource = class Resource {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], Resource.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", String)
], Resource.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: "path", type: "varchar", length: 200, nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "page_path", void 0);
__decorate([
    typeorm_1.Column({ type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "parent_id", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Resource.prototype, "sort_number", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", String)
], Resource.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], Resource.prototype, "create_date_time", void 0);
__decorate([
    typeorm_1.Column({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], Resource.prototype, "data", void 0);
__decorate([
    typeorm_1.OneToMany(() => Path, path => path.resource, { cascade: true }),
    __metadata("design:type", Array)
], Resource.prototype, "api_paths", void 0);
Resource = __decorate([
    typeorm_1.Entity("resource")
], Resource);
exports.Resource = Resource;
let Token = class Token {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], Token.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Token.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Token.prototype, "content_type", void 0);
__decorate([
    typeorm_1.Column({ name: "create_date_time", type: "datetime" }),
    __metadata("design:type", Date)
], Token.prototype, "create_date_time", void 0);
Token = __decorate([
    typeorm_1.Entity("token")
], Token);
exports.Token = Token;
let User = class User {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "user_name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], User.prototype, "create_date_time", void 0);
__decorate([
    typeorm_1.Column({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "data", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "openid", void 0);
__decorate([
    typeorm_1.Column({ type: "bit", nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_system", void 0);
__decorate([
    typeorm_1.Column({ type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "role_id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Role),
    typeorm_1.JoinColumn({ name: "role_id", referencedColumnName: "id" }),
    __metadata("design:type", Role)
], User.prototype, "role", void 0);
User = __decorate([
    typeorm_1.Entity("user")
], User);
exports.User = User;
let UserRole = class UserRole {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], UserRole.prototype, "user_id", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], UserRole.prototype, "role_id", void 0);
UserRole = __decorate([
    typeorm_1.Entity("user_role", { synchronize: false })
], UserRole);
exports.UserRole = UserRole;
let UserLatestLogin = class UserLatestLogin {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], UserLatestLogin.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], UserLatestLogin.prototype, "latest_login", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], UserLatestLogin.prototype, "create_date_time", void 0);
UserLatestLogin = __decorate([
    typeorm_1.Entity("user-latest-login")
], UserLatestLogin);
exports.UserLatestLogin = UserLatestLogin;
let SMSRecord = class SMSRecord {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], SMSRecord.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 45 }),
    __metadata("design:type", String)
], SMSRecord.prototype, "mobile", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 200 }),
    __metadata("design:type", String)
], SMSRecord.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 10 }),
    __metadata("design:type", String)
], SMSRecord.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], SMSRecord.prototype, "create_date_time", void 0);
SMSRecord = __decorate([
    typeorm_1.Entity("sms_record")
], SMSRecord);
exports.SMSRecord = SMSRecord;
let Path = class Path {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: "char", length: 36 }),
    __metadata("design:type", String)
], Path.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], Path.prototype, "create_date_time", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], Path.prototype, "value", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 200, nullable: true }),
    __metadata("design:type", String)
], Path.prototype, "remark", void 0);
__decorate([
    typeorm_1.Column({ type: "char", length: 36, nullable: true }),
    __metadata("design:type", String)
], Path.prototype, "resource_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Resource, resource => resource.api_paths),
    typeorm_1.JoinColumn({ name: "resource_id", referencedColumnName: "id" }),
    __metadata("design:type", Resource)
], Path.prototype, "resource", void 0);
Path = __decorate([
    typeorm_1.Entity("path")
], Path);
exports.Path = Path;
//# sourceMappingURL=entities.js.map
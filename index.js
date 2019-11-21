"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gateway_1 = require("./gateway");
const permission_1 = require("./permission");
const portal_1 = require("./portal");
exports.roleIds = Object.assign(gateway_1.roleIds, permission_1.roleIds);
async function start(settings) {
    await gateway_1.start(settings.gatewaySettings);
    await permission_1.start(settings.permissionSettings);
    portal_1.start(settings.portalSettings);
}
exports.start = start;

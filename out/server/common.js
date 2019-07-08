"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = {
    adminRoleId: "535e89a2-5b17-4e65-fecb-0259015b1a9b",
    controllerBasePath: "/auth",
};
let basePath = exports.constants.controllerBasePath;
exports.actionPaths = {
    user: {
        add: `${basePath}/user/add`,
        update: `${basePath}/user/update`,
        list: `${basePath}/user/list`
    },
    role: {
        add: `${basePath}/role/add`,
        update: `${basePath}/role/update`,
        remove: `${basePath}/role/remove`,
        list: `${basePath}/role/list`,
        item: `${basePath}/role/item`
    },
    menu: {
        add: `${basePath}/menu/add`,
        item: `${basePath}/menu/item`,
        update: `${basePath}/menu/update`,
        remove: `${basePath}/menu/remove`,
        list: `${basePath}/menu/list`,
    },
    token: {
        add: `${basePath}/token/add`,
        list: `${basePath}/token/list`,
    },
    path: {}
};
//# sourceMappingURL=common.js.map
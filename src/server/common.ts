export let constants = {
    adminRoleId: "535e89a2-5b17-4e65-fecb-0259015b1a9b",
    controllerBasePath: "/auth",

}

let basePath = constants.controllerBasePath;
export let actionPaths = {
    user: {
        add: `${basePath}/user/add`,
        update: `${basePath}/user/update`,
        list: `${basePath}/user/list`,
        login: `${basePath}/user/login`,
        me: `${basePath}/user/me`,
        logout: `${basePath}/user/logout`,
    },
    role: {
        add: `${basePath}/role/add`,
        update: `${basePath}/role/update`,
        remove: `${basePath}/role/remove`,
        list: `${basePath}/role/list`,
        item: `${basePath}/role/item`,
        // resourceIds: `${basePath}/role/resource/ids`,
        // setResource: `${basePath}/role/resource/set`,
        resource: {
            ids: `${basePath}/role/resource/ids`,
            set: `${basePath}/role/resource/set`,
        }
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
    path: {
        list: `${basePath}/path/list`
    },
    resource: {
        add: `${basePath}/resource/add`,
        list: `${basePath}/resource/list`,
        listByRoleId: `${basePath}/resource/listByRoleId`,
        item: `${basePath}/resource/item`,
        remove: `${basePath}/resource/remove`,
        update: `${basePath}/resource/update`,
    },
}
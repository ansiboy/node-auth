import { DataSource } from "maishu-wuzhui";
import { PermissionService } from "./permission-service";
import { errorHandle } from "maishu-chitu-admin/static";
import { LocalService, DataSourceMethods } from "./local-service";
import { User, Role, Resource, } from "entities";
import { TokenData } from "gatewayEntities";

let ps = new PermissionService((err) => {
    errorHandle(err)
});

let ls = new LocalService((err) => errorHandle(err));

let roleDataSource = new DataSource({
    primaryKeys: ["id"],
    select: async () => {
        let roles = await ps.role.list();
        return { dataItems: roles, totalRowCount: roles.length };
    },
    insert: async (item) => {
        let r = await ps.role.add(item.name, item.remark);
        Object.assign(item, r);
        return r;
    },
    update: async (item) => {
        let r = await ps.role.update(item);
        return r;
    }
})

let userDataSource = new DataSource<User>({
    primaryKeys: ["id"],
    select: async (args) => {
        let r = await ps.user.list(args);
        return r;
    },
    insert: async (item) => {
        let r = await ps.user.add(item);
        return r;
    },
    update: async (item) => {
        let r = await ps.user.update(item);
        return r;
    }
})

let tokenDataSource = new DataSource<TokenData>({
    primaryKeys: ["id"],
    select: async (args) => {
        let r = await ps.token.list(args);
        return r;
    }
})

export let dataSources = {
    role: roleDataSource,
    user: userDataSource,
    resource: ls.dataSource<Resource>("resouce"),
    token: tokenDataSource
}
import { DataSource } from "maishu-wuzhui";
import { PermissionService } from "./permission-service";
import { errorHandle, WebsiteConfig, PageDataSource } from "maishu-chitu-admin/static";
import { User, Resource, } from "entities";
import { TokenData, Role } from "gateway-entities";
import { GatewayService } from "./gateway-service";

let ps = new PermissionService((err) => {
    errorHandle(err)
});

let gs = new GatewayService((err) => {
    errorHandle(err);
})

let roleDataSource = new PageDataSource<Role>({
    primaryKeys: ["id"],
    select: async (args) => {
        let r = await gs.role.list(args);
        return r;
    },
    insert: async (item) => {
        let r = await gs.role.add(item.name, item.remark);
        Object.assign(item, r);
        return r;
    },
    update: async (item) => {
        let r = await gs.role.update(item);
        return r;
    },
    delete: async (item) => {
        let r = await gs.role.remove(item.id);
        return
    },
    itemCanDelete: (item) => !item.readonly,
    itemCanUpdate: (item) => !item.readonly,
})

export type MyUser = User & { roleNames?: string }

let userDataSource = new DataSource<MyUser>({
    primaryKeys: ["id"],
    select: async (args) => {
        let r = await ps.user.list(args);
        let userIds = r.dataItems.map(o => o.id);
        let roleses = await gs.user.roles(userIds);
        for (let i = 0; i < r.dataItems.length; i++) {
            (r.dataItems[i] as MyUser).roleNames = roleses[i].map(o => o.name).join(" ");
        }
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
        let r = await gs.tokenList(args);
        return r;
    }
})

export type MenuItem = Resource & WebsiteConfig["menuItems"][0] & {
    parent?: MenuItem,
    roleNames?: string,
}

let resourceDataSource = new DataSource<MenuItem>({
    primaryKeys: ["id"],
    select: async () => {
        let r: MenuItem[] = [];
        let [menuItems, resources, roleResult] = await Promise.all([
            gs.menuItemList(), ps.resource.list(), gs.role.list()

        ]);
        let stack = [...menuItems] as MenuItem[];
        while (stack.length > 0) {
            let item = stack.shift();
            if (item.sort_number == null) {
                item.sort_number = r.length + 1;
            }

            let roles = roleResult.dataItems;
            if (item.roleIds) {
                item.roleNames = item.roleIds.map(roleId => roles.filter(r => r.id == roleId)[0])
                    .filter(role => role != null).map(o => o.name).join(",");
            }

            r.push(item as MenuItem);
            if (item.children) {
                let children = item.children.reverse();
                children.forEach((child: MenuItem) => {
                    child.parent = item;
                    child.parent_id = item.id;
                    stack.unshift(child);
                })
            }
        }

        return { dataItems: r as MenuItem[], totalRowCount: r.length };
    }
})

export let dataSources = {
    role: roleDataSource,
    user: userDataSource,
    resource: resourceDataSource,
    token: tokenDataSource
}
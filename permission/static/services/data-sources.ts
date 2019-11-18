import { DataSource } from "maishu-wuzhui";
import { PermissionService } from "./permission-service";
import { errorHandle, WebsiteConfig } from "maishu-chitu-admin/static";
import { User, Resource, } from "entities";
import { TokenData } from "gatewayEntities";
import { GatewayService } from "./gateway-service";

let ps = new PermissionService((err) => {
    errorHandle(err)
});

let gatewayService = new GatewayService((err) => {
    errorHandle(err);
})

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
        let r = await gatewayService.tokenList(args);
        return r;
    }
})


// interface MenuItem extends Resource {
//     children: MenuItem[];
//     parent: MenuItem,
// }

export type MenuItem = Resource & WebsiteConfig["menuItems"][0] & {
    parent?: MenuItem,
    roleNames?: string,
}

let resourceDataSource = new DataSource<MenuItem>({
    primaryKeys: ["id"],
    select: async () => {
        let r: MenuItem[] = [];
        let [menuItems, resources, roles] = await Promise.all([
            gatewayService.menuItemList(), ps.resource.list(),
            ps.role.list()
        ]);
        let stack = [...menuItems] as MenuItem[];
        while (stack.length > 0) {
            let item = stack.shift();
            if (item.sort_number == null) {
                item.sort_number = r.length + 1;
            }

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
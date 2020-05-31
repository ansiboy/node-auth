import { DataSource } from "maishu-wuzhui-helper";
import { PermissionService } from "./permission-service";
import { errorHandle, WebsiteConfig } from "maishu-chitu-admin/static";
import { User, Resource, } from "permission-entities";
import { TokenData, Role } from "gateway-entities";
// import { GatewayService } from "./gateway-service";

let ps = new PermissionService((err) => {
    errorHandle(err)
});

// let gatewayService = new GatewayService((err) => {
//     errorHandle(err);
// })

// let roleDataSource = new DataSource<Role>({
//     primaryKeys: ["id"],
//     select: async (args) => {
//         let r = await gatewayService.roleList(args);
//         return r;
//     },
//     insert: async (item) => {
//         let r = await gatewayService.addRole(item.name, item.remark);
//         Object.assign(item, r);
//         return r;
//     },
//     update: async (item) => {
//         let r = await gatewayService.updateRole(item);
//         return r;
//     }
// })

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

// let tokenDataSource = new DataSource<TokenData>({
//     primaryKeys: ["id"],
//     select: async (args) => {
//         let r = await gatewayService.tokenList(args);
//         return r;
//     }
// })

export type MenuItem = WebsiteConfig["menuItems"][0] & {
    parent?: MenuItem,
    roleNames?: string,
    sortNumber?: number,
}

// let resourceDataSource = new DataSource<MenuItem>({
//     primaryKeys: ["id"],
//     select: async () => {
//         let r: MenuItem[] = [];
//         let [menuItems, resources, roleResult] = await Promise.all([
//             gatewayService.menuItemList(), ps.resource.list(),
//             gatewayService.roleList()
//         ]);
//         let stack = [...menuItems] as MenuItem[];
//         while (stack.length > 0) {
//             let item = stack.shift();
//             if (item.sortNumber == null) {
//                 item.sortNumber = r.length + 1;
//             }

//             let roles = roleResult.dataItems;
//             if (item.roleIds) {
//                 item.roleNames = item.roleIds.map(roleId => roles.filter(r => r.id == roleId)[0])
//                     .filter(role => role != null).map(o => o.name).join(",");
//             }

//             r.push(item as MenuItem);
//             if (item.children) {
//                 let children = item.children.reverse();
//                 children.forEach((child: MenuItem) => {
//                     child.parent = item;
//                     child.parentId = item.id;
//                     stack.unshift(child);
//                 })
//             }
//         }

//         return { dataItems: r as MenuItem[], totalRowCount: r.length };
//     },
//     update: async (item) => {

//     }
// })

export let dataSources = {
    // role: roleDataSource,
    user: userDataSource,
    // resource: resourceDataSource,
    // token: tokenDataSource
}
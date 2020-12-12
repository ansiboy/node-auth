import { DataSource } from "maishu-wuzhui-helper"
import { WebsiteConfig } from "maishu-chitu-admin";
import { GatewayService } from "./gateway-service";
import { Role, TokenData, Station } from "gateway-entities";

export type MenuItem = WebsiteConfig["menuItems"][0] & {
    parent?: MenuItem,
    roleNames?: string,
    sortNumber?: number,
}

let gatewayService = new GatewayService();

let resourceDataSource = new DataSource<MenuItem>({
    primaryKeys: ["id"],
    select: async () => {
        let r: MenuItem[] = [];
        let [menuItems, roleResult] = await Promise.all([
            gatewayService.menuItemList(),// gatewayService.resourceList(),
            gatewayService.roleList()
        ]);
        let stack = [...menuItems] as MenuItem[];
        while (stack.length > 0) {
            let item = stack.shift();
            if (item.sortNumber == null) {
                item.sortNumber = r.length + 1;
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
                    child.parentId = item.id;
                    stack.unshift(child);
                })
            }
        }

        return { dataItems: r as MenuItem[], totalRowCount: r.length };
    },
    update: async (item) => {

    },
    insert: async () => {

    }
})

let roleDataSource = new DataSource<Role>({
    primaryKeys: ["id"],
    select: async (args) => {
        let r = await gatewayService.roleList(args);
        return r;
    },
    insert: async (item) => {
        let r = await gatewayService.addRole(item.name, item.remark);
        Object.assign(item, r);
        return r;
    },
    update: async (item) => {
        let r = await gatewayService.updateRole(item);
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

let stationDataSource = new DataSource<Station>({
    primaryKeys: ["id"],
    select: async (args) => {
        let r = await gatewayService.stationList();
        return { dataItems: r, totalRowCount: r.length };
    },
    insert: async (item) => {
        let r = await gatewayService.addStation(item);
        return item;
    },
    delete: async (item) => {
        let r = await gatewayService.removeStation(item.id);
        return r;
    }
})

export let dataSources = {
    resource: resourceDataSource,
    role: roleDataSource,
    token: tokenDataSource,
    station: stationDataSource,
}
import { DataSource } from "maishu-wuzhui";
import { PermissionService } from "maishu-services-sdk";
import { errorHandle } from "maishu-chitu-admin/static";

PermissionService.baseUrl = "../service/auth";

let ps = new PermissionService((err) => {
    debugger;
    errorHandle(err)
});
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

export let dataSources = {
    role: roleDataSource
}
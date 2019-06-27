import { DataSource, DataSourceSelectArguments, DataSourceSelectResult, DataSourceArguments } from "maishu-wuzhui";
import { PermissionService, Role } from "maishu-services-sdk";

import { alert } from "maishu-ui-toolkit";
import { User } from "maishu-services-sdk";
import { Application } from "maishu-chitu-react";

// import { Role } from '../../out/server/entities';

// let adminService = app.createService(AdminService)
// let messageService = app.createService(MessageService)
// let permissionService = app.createService(PermissionService)

export class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;

    constructor(params: DataSourceArguments<T> & { getItem?: (id: string) => Promise<T> }) {
        super(params)

        if (params.getItem == null) {
            params.getItem = async (id: string) => {
                let filter = `id = '${id}'`
                let args = new DataSourceSelectArguments()
                args.filter = filter
                let r = await this.executeSelect(args) as DataSourceSelectResult<T>
                return r.dataItems[0]
            }
        }

        this.getItem = params.getItem
    }
}


export function createRoleDataSource(app: Application) {
    let permissionService = app.createService(PermissionService);
    let roleDataSource = new MyDataSource<Role>({
        primaryKeys: ['id'],
        async select() {
            let roles = await permissionService.getRoles()
            return { dataItems: roles, totalRowCount: roles.length }
        },
        async getItem(id) {
            let role = await permissionService.getRole(id)
            return role
        }
    })

    return roleDataSource;
}


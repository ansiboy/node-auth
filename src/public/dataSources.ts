import { DataSource, DataSourceSelectArguments, DataSourceSelectResult, DataSourceArguments } from "maishu-wuzhui";
import { Role, MenuItem } from "maishu-services-sdk";
import { PermissionService } from "services/permission-service";
import { g } from "init";

let permissionService = g.app.createService(PermissionService);

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


function createRoleDataSource() {
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

let menuDataSource = new MyDataSource<MenuItem>({
    primaryKeys: ['id'],
    async select(args) {
        let r = await permissionService.getMenuResource(args.startRowIndex, args.maximumRows, args.filter) as DataSourceSelectResult<MenuItem>
        return r
    },
    async getItem(id: string) {
        let menuItem = await permissionService.getMenuItem(id)
        menuItem.originalChildren = Object.assign([], menuItem.children)
        return menuItem
    },
    delete(item) {
        return permissionService.deleteResource(item.id)
    },
    async insert(item) {
        let obj: typeof item = JSON.parse(JSON.stringify(item))
        delete obj.children
        delete obj.originalChildren
        delete obj.visible

        let r = await permissionService.addResource(obj)
        console.assert(r.id != null)
        Object.assign(item, r)

        item.children.forEach(child => {
            child.parent_id = item.id
            permissionService.addResource(child)
        })

        return r
    },
    async update(item) {
        item.children = item.children || []
        item.originalChildren = item.originalChildren || []
        // 查找要删除的
        for (let i = 0; i < item.originalChildren.length; i++) {
            let child = item.children.filter(o => o.id == item.originalChildren[i].id)[0]
            if (child == null) {
                permissionService.deleteResource(item.originalChildren[i].id)
            }
        }

        // 查找要添加的
        for (let i = 0; i < item.children.length; i++) {
            let child = item.originalChildren.filter(o => o.id == item.children[i].id)[0]
            if (child == null) {
                console.assert(item.children[i].parent_id == item.id)
                let obj = Object.assign({}, item.children[i])
                delete obj.children
                delete obj.originalChildren
                delete obj.visible
                permissionService.addResource(obj)
            }
        }
        item.parent_id = !item.parent_id ? null : item.parent_id
        let obj: typeof item = JSON.parse(JSON.stringify(item))
        delete obj.children
        delete obj.originalChildren
        await permissionService.updateResource(obj)
        item.children = Object.assign([], item.originalChildren)
    }
})


export let dataSources = {
    role: createRoleDataSource(),
    menu: menuDataSource,
}


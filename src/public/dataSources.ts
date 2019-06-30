import { DataSource, DataSourceSelectArguments, DataSourceSelectResult, DataSourceArguments } from "maishu-wuzhui";
import { Role, MenuItem } from "maishu-services-sdk";
import { PermissionService } from "services/permission-service";
import { g } from "init";

let permissionService: PermissionService = g.app.createService<PermissionService>(PermissionService);

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
            let roles = await permissionService.role.list();
            return { dataItems: roles, totalRowCount: roles.length };
        },
        async getItem(id) {
            let role = await permissionService.role.item(id);
            return role
        },
        async insert(item) {
            let r = await permissionService.role.add(item);
            return r;
        },
        async delete(item) {
            let r = await permissionService.role.remove(item.id);
            return r;
        }
    })

    return roleDataSource;
}

export function createMenuDataSource() {
    let menuDataSource = new MyDataSource<MenuItem>({
        primaryKeys: ['id'],
        async select(args) {
            let r = await permissionService.menu.list(args);
            return { dataItems: r, totalRowCount: r.length };
        },
        async getItem(id: string) {
            // let menuItem = await permissionService.getMenuItem(id)
            // menuItem.originalChildren = Object.assign([], menuItem.children)
            // return menuItem
            let r = await permissionService.resource.item(id);
            return r;
        },
        delete(item) {
            // return permissionService.deleteResource(item.id)
            return permissionService.resource.remove(item.id);
        },
        async insert(item) {
            let obj: typeof item = JSON.parse(JSON.stringify(item))
            delete obj.children
            delete obj.originalChildren
            delete obj.visible

            let r = await permissionService.resource.add(obj)
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
    return menuDataSource;
}

export class DataSources {
    role = createRoleDataSource();
    menu = createMenuDataSource();
}

export let dataSources = new DataSources();


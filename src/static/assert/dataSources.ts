import { DataSource, DataSourceSelectArguments, DataSourceSelectResult, DataSourceArguments } from "maishu-wuzhui";
import { PermissionService } from "./services/index";
import { MenuItem } from "./masters/main-master-page";
import { User, Role, Path, Resource } from "entities";
import errorHandle from "error-handle";

let permissionService: PermissionService = new PermissionService((error) => errorHandle(error));

export class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;

    constructor(params: DataSourceArguments<T> & { item?: (id: string) => Promise<T> }) {
        super(params)

        if (params.item == null) {
            params.item = async (id: string) => {
                let filter = `id = '${id}'`
                let args = new DataSourceSelectArguments()
                args.filter = filter
                let r = await this.executeSelect(args) as DataSourceSelectResult<T>
                return r.dataItems[0]
            }
        }

        this.getItem = params.item
    }
}


function createRoleDataSource() {
    let roleDataSource = new MyDataSource<Role>({
        primaryKeys: ['id'],
        async select() {
            let roles = await permissionService.role.list();
            return { dataItems: roles, totalRowCount: roles.length };
        },
        async item(id) {
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
        },
        async update(item) {
            let r = await permissionService.role.update(item);
            return r;
        }
    })

    return roleDataSource;
}

export function translateToMenuItems(resources: Resource[]): MenuItem[] {
    let arr = new Array<MenuItem>();
    let stack: MenuItem[] = [...resources.filter(o => o.parent_id == null).reverse() as MenuItem[]];
    while (stack.length > 0) {
        let item = stack.pop();
        item.children = resources.filter(o => o.parent_id == item.id) as MenuItem[];
        if (item.parent_id) {
            item.parent = resources.filter(o => o.id == item.parent_id)[0] as MenuItem;
        }

        stack.push(...item.children.reverse());

        arr.push(item);
    }

    let ids = arr.map(o => o.id);
    for (let i = 0; i < ids.length; i++) {
        let item = arr.filter(o => o.id == ids[i])[0];
        console.assert(item != null);

        if (item.children.length > 1) {
            item.children.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
        }
    }

    return arr;
}

export function createUserDataSource() {
    let userDataSource = new MyDataSource<User>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.user.list(args);
            r.dataItems.forEach(o => {
                o.data = o.data || {};
            });

            return r;
        },
        update: async (item) => {
            let r = await permissionService.user.update(item);
            return r;
        },
        insert: async (item) => {
            let roleIds: string[];
            let r = await permissionService.user.add(item, roleIds);
            return r;
        },
        delete: async (item) => {
            return permissionService.user.remove(item.id);
        }

    })

    return userDataSource;
}

function createTokenDataSource() {
    let tokenDataSource = new MyDataSource<any>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.token.list(args);
            return r;
        },
        insert: async (item) => {
            let r = await permissionService.token.add(item);
            return r;
        }
    })

    return tokenDataSource;
}

function createPathDataSource() {
    let dataSource = new MyDataSource<Path>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.path.list();
            return { dataItems: r, totalRowCount: r.length };
        }
    })

    return dataSource;
}

function createResourceDataSource() {
    let dataSource = new MyDataSource<Resource>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.resource.list();
            return { dataItems: r, totalRowCount: r.length };
        },
        item: async (id) => {
            let r = await permissionService.resource.item(id);
            debugger
            return r;
        },
        update: async (item) => {
            item = Object.assign({}, item);
            let menuItem = item as MenuItem;
            delete menuItem.children;
            delete menuItem.parent;

            let r = await permissionService.resource.update(item);
            return r;
        },
        insert: async (item) => {
            let r = await permissionService.resource.add(item);
            return r;
        },
        delete: async (item) => {
            let r = await permissionService.resource.remove(item.id);
            return r;
        }
    })

    return dataSource;
}

export interface Module extends MenuItem {
    paths?: Path[]
}

function createModuleDataSource() {
    let dataSource = new DataSource<Module>({
        primaryKeys: ["id"],
        select: async () => {
            let [resources, paths, resourcePaths] = await Promise.all([
                permissionService.resource.list(), permissionService.path.list(), permissionService.resourcePaths.list()
            ]);

            let dataItems = translateToMenuItems(resources);
            dataItems.forEach(dataItem => {
                let pathIds = resourcePaths.filter(o => o.resource_id == dataItem.id).map(o => o.path_id);
                (dataItem as Module).paths = paths.filter(o => pathIds.indexOf(o.id) >= 0);
            })
            return { dataItems, totalRowCount: dataItems.length };
        },
        update: async (dataItem) => {
            await permissionService.resource.path.set(dataItem.id, dataItem.paths.map(o => o.value));
        }
    })

    return dataSource;
}

export class DataSources {
    role = createRoleDataSource();
    user = createUserDataSource();
    token = createTokenDataSource();
    path = createPathDataSource();
    resource = createResourceDataSource();
    module = createModuleDataSource();
}

export let dataSources = new DataSources();


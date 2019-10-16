import { PermissionService, User, DataSourceSelectResult, Role, Resource, Token } from "maishu-services-sdk";
import { controller, action, routeData, createParameterDecorator } from "maishu-node-mvc";
import { errors } from "../../service/errors";

export let currentUserId = createParameterDecorator(async (req, res) => {
    let userId = req.headers["user_id"] || req.headers["userid"];

    if (userId == null)
        throw errors.canntGetUserIdFromHeader();

    return userId;
})

@controller("data-sources")
export class DataSourcesController {
    ps: PermissionService;
    constructor() {
        this.ps = new PermissionService();
    }

    @action()
    insert_user(@routeData { item }) {
        return this.ps.user.add(item);
    }

    @action()
    update_user(@routeData { item }) {
        return this.ps.user.update(item);
    }

    @action()
    select_user(@routeData { args }): Promise<DataSourceSelectResult<User>> {
        return this.ps.user.list(args);
    }

    @action()
    async select_role(@currentUserId userId): Promise<DataSourceSelectResult<Role>> {
        let roles = await this.ps.user.role.list(userId);
        return { dataItems: roles, totalRowCount: roles.length };
    }

    @action()
    insert_role(@routeData { item }) {
        return this.ps.role.add(item);
    }

    @action()
    update_role(@routeData { item }) {
        return this.ps.role.update(item);
    }

    @action()
    delete_role(@routeData { item }) {
        return this.ps.role.remove(item.id);
    }

    @action()
    async select_resouce(@currentUserId userId): Promise<DataSourceSelectResult<Resource>> {
        if (userId == null) throw errors.currentUserIdNull();

        let r = await this.ps.user.resource.list(userId);
        return { dataItems: r, totalRowCount: r.length };
    }

    @action()
    async insert_resource(@routeData { item }) {
        let r = await this.ps.resource.add(item);
        return r;
    }

    @action()
    async select_token(@routeData { args }): Promise<DataSourceSelectResult<Token>> {
        return this.ps.token.list(args);
    }

    @action()
    async insert_token(@routeData { item }) {
        return this.ps.token.add(item);
    }

}
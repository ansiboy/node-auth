import "reflect-metadata";
import { EntityManager, Repository, DataContext, DataHelper } from "maishu-node-data";
import path = require("path");
import { TokenData, Role, UserRole, MenuItemRecord, Station, ApplicationIdBinding, Application } from "../entities";
import { g } from "../global";

export class AuthDataContext extends DataContext {

    tokenDatas: Repository<TokenData>;
    roles: Repository<Role>;
    userRoles: Repository<UserRole>;
    menuItemRecords: Repository<MenuItemRecord>;
    stations: Repository<Station>;
    appIdBindings: Repository<ApplicationIdBinding>;
    apps: Repository<Application>;

    static entitiesPath = path.join(__dirname, "../entities.js");

    constructor(entityManager: EntityManager) {
        super(entityManager);

        this.tokenDatas = this.manager.getRepository(TokenData);
        this.roles = this.manager.getRepository(Role);
        this.userRoles = this.manager.getRepository(UserRole);
        this.menuItemRecords = this.manager.getRepository(MenuItemRecord);
        this.stations = this.manager.getRepository(Station);
        this.appIdBindings = this.manager.getRepository(ApplicationIdBinding);
        this.apps = this.manager.getRepository(Application);
    }

    /**
     * 获取指定用户的角色 ID
     * @param userId 指定的用户 ID
     */
    static async getUserRoleIds(userId: string): Promise<string[]> {
        //TODO: 缓存 roleids
        let dc = await DataHelper.createDataContext(AuthDataContext, g.settings.db);
        let userRoles = await dc.userRoles.find({ user_id: userId });
        return userRoles.map(o => o.role_id);
    }
}

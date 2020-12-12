import "reflect-metadata";
import { EntityManager, Repository, DataContext, DataHelper, ConnectionOptions } from "maishu-node-data";
import path = require("path");
import { TokenData, Role, UserRole, MenuItemRecord, Station } from "../entities";
import { createParameterDecorator } from "maishu-node-mvc";
import { g, roleIds, userIds } from "../global";
import { getTokenData } from "../filters/authenticate";

export class AuthDataContext extends DataContext {

    tokenDatas: Repository<TokenData>;
    roles: Repository<Role>;
    userRoles: Repository<UserRole>;
    menuItemRecords: Repository<MenuItemRecord>;
    stations: Repository<Station>;

    static entitiesPath = path.join(__dirname, "entities.js");

    constructor(entityManager: EntityManager) {
        super(entityManager);

        this.tokenDatas = this.manager.getRepository(TokenData);
        this.roles = this.manager.getRepository(Role);
        this.userRoles = this.manager.getRepository(UserRole);
        this.menuItemRecords = this.manager.getRepository(MenuItemRecord);
        this.stations = this.manager.getRepository(Station);
    }
}

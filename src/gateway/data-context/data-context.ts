import "reflect-metadata";
import { Repository, ConnectionOptions, Connection, getConnectionManager, createConnection, getConnection } from "maishu-node-data";
import path = require("path");
import { TokenData, Role, UserRole, MenuItemRecord, Station, DomainBinding, Application } from "../entities";
import { g } from "../global";
import { CacheData } from "./cache-data";
import { errors } from "maishu-toolkit";

export class AuthDataContext {

    tokenDatas: Repository<TokenData>;
    roles: Repository<Role>;
    userRoles: Repository<UserRole>;
    menuItemRecords: Repository<MenuItemRecord>;
    stations: Repository<Station>;
    domainBindings: CacheData<DomainBinding>;
    apps: CacheData<Application>;

    static entitiesPath = path.join(__dirname, "../entities.js");

    private conn: Connection;

    private constructor(conn: Connection) {
        if (!conn) throw errors.argumentNull("conn");

        this.conn = conn;
        this.tokenDatas = conn.getRepository(TokenData);
        this.roles = conn.getRepository(Role);
        this.userRoles = conn.getRepository(UserRole);
        this.menuItemRecords = conn.getRepository(MenuItemRecord);
        this.stations = conn.getRepository(Station);
    }

    private async init() {

        let [apps, appIdBindings] = await Promise.all([
            CacheData.create(this.conn.getRepository(Application)),
            CacheData.create(this.conn.getRepository(DomainBinding)),
        ]);

        this.apps = apps;
        this.domainBindings = appIdBindings;
    }

    static async create(db: ConnectionOptions): Promise<AuthDataContext> {

        if (!db) throw errors.argumentNull("db");

        Object.assign(db, { entities: [AuthDataContext.entitiesPath], name: "AuthDataContext" } as ConnectionOptions);
        let conn = await getMyConnection(db);

        let dc = new AuthDataContext(conn);
        await dc.init();

        return dc;
    }

    /**
     * 获取指定用户的角色 ID
     * @param userId 指定的用户 ID
     */
    static async getUserRoleIds(userId: string): Promise<string[]> {
        //TODO: 缓存 roleids

        let dc = await AuthDataContext.create(g.settings.db);//await AuthDataContext.create(g.settings.db);
        let userRoles = await dc.userRoles.find({ user_id: userId });
        return userRoles.map(o => o.role_id);
    }
}

function getMyConnection(db: ConnectionOptions) {
    return new Promise<Connection>(async (resolve, reject) => {
        let connectionManager = getConnectionManager();
        let name = db.name as string;

        if (!db.name) {
            reject(errors.argumentFieldNull("name", "db"));
            return;
        }

        console.assert(name != null);
        let connection: Connection;
        if (!connectionManager.has(name)) {
            let dbOptions = db;
            connection = await createConnection(dbOptions);
        }
        else {
            connection = getConnection(name);

        }
        return resolve(connection);
    });
}

import "reflect-metadata";
import { createConnection, EntityManager, Repository, Connection, getConnection, ConnectionOptions, getConnectionManager } from "maishu-node-data";
import { Category, Resource, User, UserLatestLogin, SMSRecord, ResourcePath } from "./entities";
import { ConnectionConfig, Connection as DBConnection } from "mysql";
import path = require("path");
import { createParameterDecorator } from "maishu-node-mvc";
import { settings, roleIds } from "./global";
import { errors } from "./errors";
import { tokenDataHeaderNames, userIds } from "../gateway";
import { adminMobile, adminPassword } from "./website-config";
import { DataContext } from "maishu-node-data";

export class UserDataContext extends DataContext {
    private entityManager: EntityManager;

    categories: Repository<Category>;
    // roles: Repository<Role>;
    resources: Repository<Resource>;
    users: Repository<User>;
    // userRoles: Repository<UserRole>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    resourcePaths: Repository<ResourcePath>;
    // menuItemRecords: Repository<MenuItemRecord>;

    baseModuleResourceId: string;

    static entitiesPath = path.join(__dirname, "entities.js");

    constructor(entityManager: EntityManager) {
        super(entityManager);

        this.entityManager = entityManager;
        // this.roles = this.entityManager.getRepository<Role>(Role);
        this.categories = this.entityManager.getRepository<Category>(Category);
        this.resources = this.entityManager.getRepository<Resource>(Resource);
        this.users = this.entityManager.getRepository<User>(User);
        // this.userRoles = this.entityManager.getRepository(UserRole);
        this.userLatestLogins = this.entityManager.getRepository<UserLatestLogin>(UserLatestLogin);
        this.smsRecords = this.entityManager.getRepository<SMSRecord>(SMSRecord);
        this.resourcePaths = this.entityManager.getRepository<ResourcePath>(ResourcePath);
        // this.menuItemRecords = this.entityManager.getRepository(MenuItemRecord);
    }
}


export async function createDataContext(connConfig: ConnectionConfig): Promise<UserDataContext> {
    let connectionManager = getConnectionManager();
    if (connectionManager.has(connConfig.database) == false) {
        let entities: string[] = [path.join(__dirname, "entities.js")]
        let dbOptions: ConnectionOptions = {
            type: "mysql",
            host: connConfig.host,
            port: connConfig.port,
            username: connConfig.user,
            password: connConfig.password,
            database: connConfig.database,
            charset: connConfig.charset,
            synchronize: true,
            logging: false,
            connectTimeout: 3000,
            entities,
            name: connConfig.database
        }

        await createConnection(dbOptions);
    }


    let connection = getConnection(connConfig.database);
    let dc = new UserDataContext(connection.manager);
    return dc
}

export let permissionDataContext = createParameterDecorator<UserDataContext>(
    async () => {
        console.assert(settings.db != null);
        let dc = await createDataContext(settings.db);
        return dc
    },
    async () => {
    }
)

export let currentUser = createParameterDecorator(async (req, res) => {
    let userId = req.headers[tokenDataHeaderNames.userId] as string;
    if (!userId)
        return null;

    let dc = await createDataContext(settings.db);
    let user = await dc.users.findOne(userId);

    if (!user)
        throw errors.objectNotExistWithId(userId, "User");

    return user;
})

export let currentUserId = createParameterDecorator(async (req, res) => {
    let userId = req.headers[tokenDataHeaderNames.userId];

    if (userId == null)
        throw errors.canntGetUserIdFromHeader();

    return userId;
})

export async function initDatabase(db: ConnectionConfig) {
    if (!db) throw errors.argumentNull("db");
    let dc = await createDataContext(db);
    await initUserTable(dc);
}

async function initUserTable(dc: UserDataContext) {
    let admin: User = {
        id: userIds.admin,
        mobile: adminMobile,
        password: adminPassword,
        user_name: "admin",
        create_date_time: new Date(Date.now()),
        is_system: true,
    }

    await dc.users.save(admin);

}



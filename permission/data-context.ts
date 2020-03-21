import "reflect-metadata";
import { createConnection, EntityManager, Repository, getConnection, ConnectionOptions, getConnectionManager, DataHelper, DataContext } from "maishu-node-data";
import { Category, Resource, User, UserLatestLogin, SMSRecord, ResourcePath } from "./entities";
import { ConnectionConfig } from "mysql";
import path = require("path");
import { createParameterDecorator, ServerContext } from "maishu-node-mvc";
import { ServerContextData } from "./global";
import { errors } from "./errors";
import { tokenDataHeaderNames, userIds } from "../gateway";
import { adminMobile, adminPassword } from "./website-config";

export class PermissionDataContext extends DataContext {
    categories: Repository<Category>;
    // roles: Repository<Role>;
    resources: Repository<Resource>;
    users: Repository<User>;
    // userRoles: Repository<UserRole>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    resourcePaths: Repository<ResourcePath>;

    baseModuleResourceId: string;

    constructor(connConfig: ConnectionConfig) {
        super(connConfig, path.join(__dirname, "entities.js"));

        // this.roles = this.entityManager.getRepository<Role>(Role);
        this.categories = this.manager.getRepository<Category>(Category);
        this.resources = this.manager.getRepository<Resource>(Resource);
        this.users = this.manager.getRepository<User>(User);
        // this.userRoles = this.entityManager.getRepository(UserRole);
        this.userLatestLogins = this.manager.getRepository<UserLatestLogin>(UserLatestLogin);
        this.smsRecords = this.manager.getRepository<SMSRecord>(SMSRecord);
        this.resourcePaths = this.manager.getRepository<ResourcePath>(ResourcePath);
    }

}


export async function createDataContext(connConfig: ConnectionConfig): Promise<PermissionDataContext> {
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

    let dc = new PermissionDataContext(connConfig);
    return dc
}

export let permissionDataContext = createParameterDecorator<PermissionDataContext>(
    async (req, res, context: ServerContext<ServerContextData>) => {
        console.assert(context.data.db != null);
        let dc = await createDataContext(context.data.db);
        return dc
    },
    async () => {
    }
)

export let currentUser = createParameterDecorator(async (req, res, context: ServerContext<ServerContextData>) => {
    let userId = req.headers[tokenDataHeaderNames.userId] as string;
    if (!userId)
        return null;

    let dc = await createDataContext(context.data.db);
    let user = await dc.users.findOne(userId);

    if (!user)
        throw errors.objectNotExistWithId(userId, "User");

    return user;
})

export let currentUserId = createParameterDecorator(async (req) => {
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

async function initUserTable(dc: PermissionDataContext) {
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



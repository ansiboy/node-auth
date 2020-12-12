import "reflect-metadata";
import { createConnection, EntityManager, Repository, getConnection, ConnectionOptions, getConnectionManager, DataHelper } from "maishu-node-data";
import { Category, Resource, User, UserLatestLogin, SMSRecord, ResourcePath } from "../entities";
import { ConnectionConfig } from "mysql";
import path = require("path");
import { createParameterDecorator } from "maishu-node-mvc";
import { settings } from "../global";
import { errors } from "../errors";
import { userIds } from "../../gateway";
import { adminMobile, adminPassword } from "../website-config";
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


// export async function createDataContext(connConfig: ConnectionOptions): Promise<UserDataContext> {
//     let connectionManager = getConnectionManager();
//     if (!connConfig.database)
//         throw errors.connectionOptionFieldNull("database");
//     if (!connConfig.type)
//         throw errors.connectionOptionFieldNull("type");

//     let databaseName: string = typeof connConfig.database == "string" ? connConfig.database : connConfig.database.toString();
//     if (connectionManager.has(databaseName) == false) {
//         let entities: string[] = [path.join(__dirname, "entities.js")]
//         let dbOptions: ConnectionOptions = Object.assign({
//             // type: "mysql",
//             // host: connConfig.host,
//             // port: connConfig.port,
//             // username: connConfig.user,
//             // password: connConfig.password,
//             database: databaseName,
//             charset: "utf8",
//             synchronize: true,
//             logging: false,
//             connectTimeout: 3000,
//             entities,
//             name: databaseName
//         }, connConfig);

//         // let dbOptions: ConnectionOptions = {
//         //     // host: connConfig.host,
//         //     // port: connConfig.port,
//         //     // username: connConfig.user,
//         //     // password: connConfig.password,
//         //     database: connConfig.database,
//         //     // charset: connConfig.charset,
//         //     synchronize: true,
//         //     logging: false,
//         //     // connectTimeout: 3000,
//         //     entities,
//         //     name: databaseName
//         // }


//         await createConnection(dbOptions);
//     }


//     let connection = getConnection(databaseName);
//     let dc = new UserDataContext(connection.manager);
//     return dc
// }

// export let permissionDataContext = createParameterDecorator<UserDataContext>(
//     async () => {
//         console.assert(settings.db != null);
//         let dc = await createDataContext(settings.db);
//         return dc
//     },
//     async () => {
//     }
// )


// export let currentUserId = createParameterDecorator(async (context) => {

//     let userId = context.req.headers[tokenDataHeaderNames.userId];

//     if (userId == null)
//         throw errors.canntGetUserIdFromHeader();

//     return userId;
// })

// export async function initDatabase(db: ConnectionOptions) {
//     if (!db) throw errors.argumentNull("db");
//     let dc = await DataHelper.createDataContext(UserDataContext, db);
//     await initUserTable(dc);
// }

// async function initUserTable(dc: UserDataContext) {
//     let admin: User = {
//         id: userIds.admin,
//         mobile: adminMobile,
//         password: adminPassword,
//         user_name: "admin",
//         create_date_time: new Date(Date.now()),
//         is_system: true,
//     }

//     await dc.users.save(admin);

// }



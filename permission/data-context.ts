import "reflect-metadata";
import { createConnection, EntityManager, Repository, Connection, getConnection, ConnectionOptions } from "typeorm";
import { Category, Resource, User, UserLatestLogin, SMSRecord, ResourcePath } from "./entities";
import { ConnectionConfig, Connection as DBConnection } from "mysql";
import path = require("path");
import { createParameterDecorator } from "maishu-node-mvc";
import { settings, roleIds } from "./global";
import { errors } from "./errors";
import { tokenDataHeaderNames, userIds } from "../gateway";
import { adminMobile, adminPassword } from "./website-config";
import { guid } from "maishu-chitu-service";

export class PermissionDataContext {
    private entityManager: EntityManager;
    categories: Repository<Category>;
    // roles: Repository<Role>;
    resources: Repository<Resource>;
    users: Repository<User>;
    // userRoles: Repository<UserRole>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    resourcePaths: Repository<ResourcePath>;

    baseModuleResourceId: string;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        // this.roles = this.entityManager.getRepository<Role>(Role);
        this.categories = this.entityManager.getRepository<Category>(Category);
        this.resources = this.entityManager.getRepository<Resource>(Resource);
        this.users = this.entityManager.getRepository<User>(User);
        // this.userRoles = this.entityManager.getRepository(UserRole);
        this.userLatestLogins = this.entityManager.getRepository<UserLatestLogin>(UserLatestLogin);
        this.smsRecords = this.entityManager.getRepository<SMSRecord>(SMSRecord);
        this.resourcePaths = this.entityManager.getRepository<ResourcePath>(ResourcePath);
    }

}


let connections: { [dbName: string]: Connection } = {};

export async function createDataContext(connConfig: ConnectionConfig): Promise<PermissionDataContext> {
    let connection = connections[connConfig.database];
    if (connection == null) {
        let entities: string[] = [path.join(__dirname, "entities.js")]
        let dbOptions: ConnectionOptions = {
            type: "mysql",
            host: connConfig.host,
            port: connConfig.port,
            username: connConfig.user,
            password: connConfig.password,
            database: connConfig.database,
            synchronize: true,
            logging: false,
            connectTimeout: 3000,
            entities,
            name: connConfig.database
        }

        connection = await createConnection(dbOptions);
        connections[connConfig.database] = connection;
    }


    connection = getConnection(connConfig.database);
    // console.assert(connection == connection1);

    let dc = new PermissionDataContext(connection.manager);
    return dc
}

export let permissionDataContext = createParameterDecorator<PermissionDataContext>(
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
    let user = await dc.users.findOne(userId, { relations: ["roles"] });

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
    // await initRoleTable(dc);
    await initUserTable(dc);

}

// async function initRoleTable(dc: PermissionDataContext) {
//     let count = await dc.roles.count();
//     if (count > 0)
//         return;

//     let adminRole: Role = {
//         id: roleIds.adminRoleId,
//         name: "管理员",
//         remark: "系统预设的管理员",
//         create_date_time: new Date(Date.now()),
//     }

//     await dc.roles.save(adminRole);

//     let anonymousRole: Role = {
//         id: roleIds.anonymousRoleId,
//         name: "匿名用户组",
//         remark: "系统预设的匿名用户组",
//         create_date_time: new Date(Date.now()),
//     }

//     await dc.roles.save(anonymousRole);

//     let normalUserRole: Role = {
//         id: roleIds.normalUserRoleId,
//         name: "普通用户",
//         remark: "",
//         create_date_time: new Date(Date.now()),
//     }

//     await dc.roles.save(normalUserRole);
// }

async function initUserTable(dc: PermissionDataContext) {
    let count = await dc.users.count();
    if (count > 0)
        return;

    // let adminRole = await dc.roles.findOne(roleIds.adminRoleId);

    let admin: User = {
        id: userIds.admin,
        mobile: adminMobile,
        password: adminPassword,
        user_name: "admin",
        create_date_time: new Date(Date.now()),
        is_system: true,
        // roles: [adminRole]
    }

    await dc.users.save(admin);

}

// async function initResource(dc: AuthDataContext) {

// }


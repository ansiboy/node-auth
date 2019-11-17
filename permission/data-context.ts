import "reflect-metadata";
import { createConnection, EntityManager, Repository, Connection, getConnection, ConnectionOptions } from "typeorm";
import { Role, Category, Resource, User, UserLatestLogin, SMSRecord, Path, RoleResource, ResourcePath, UserRole } from "./entities";
import { ConnectionConfig } from "mysql";
import path = require("path");
import { createParameterDecorator } from "maishu-node-mvc";
import { settings } from "./global";
import { tokenDataHeaderNames } from "maishu-node-auth-gateway";
import { errors } from "./errors";

export class PermissionDataContext {
    private entityManager: EntityManager;
    categories: Repository<Category>;
    roles: Repository<Role>;
    resources: Repository<Resource>;
    // tokens: Repository<Token>;
    users: Repository<User>;
    userRoles: Repository<UserRole>;
    userLatestLogins: Repository<UserLatestLogin>;
    smsRecords: Repository<SMSRecord>;
    paths: Repository<Path>;
    roleResources: Repository<RoleResource>;
    resourcePaths: Repository<ResourcePath>;

    baseModuleResourceId: string;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.roles = this.entityManager.getRepository<Role>(Role);
        this.categories = this.entityManager.getRepository<Category>(Category);
        this.resources = this.entityManager.getRepository<Resource>(Resource);
        // this.tokens = this.entityManager.getRepository<Token>(Token);
        this.users = this.entityManager.getRepository<User>(User);
        this.userRoles = this.entityManager.getRepository(UserRole);
        this.userLatestLogins = this.entityManager.getRepository<UserLatestLogin>(UserLatestLogin);
        this.smsRecords = this.entityManager.getRepository<SMSRecord>(SMSRecord);
        this.paths = this.entityManager.getRepository<Path>(Path);
        this.roleResources = this.entityManager.getRepository<RoleResource>(RoleResource);
        this.resourcePaths = this.entityManager.getRepository<ResourcePath>(ResourcePath);
    }

}


let connections: { [dbName: string]: Connection } = {};

export async function createDataContext(conn: ConnectionConfig): Promise<PermissionDataContext> {
    let connection = connections[conn.database];
    if (connection == null) {
        let entities: string[] = [path.join(__dirname, "entities.js")]
        let dbOptions: ConnectionOptions = {
            type: "mysql",
            host: conn.host,
            port: conn.port,
            username: conn.user,
            password: conn.password,
            database: conn.database,
            synchronize: true,
            logging: false,
            connectTimeout: 3000,
            entities,
            name: conn.database
        }

        connection = await createConnection(dbOptions);
        connections[conn.database] = connection;
    }


    connection = getConnection(conn.database);
    // console.assert(connection == connection1);

    let dc = new PermissionDataContext(connection.manager)
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

// async function initDatabase(dc: AuthDataContext, adminMobile: string, adminPassword: string) {
//     if (!dc) throw errors.argumentNull("dc");
//     await initRoleTable(dc);
//     await initResource(dc);
//     await initUserTable(dc, adminMobile, adminPassword);

// }

// let adminRoleId = roleIds.adminRoleId;
// let anonymousRoleId = roleIds.anonymousRoleId;
// let adminUserId = "240f103f-02a3-754c-f587-db122059fdfb";
// let buttonControlsPath = "assert/controls/button.js";
// let baseModuleResourceId = "AA3F1B10-311D-473E-A851-80D6FD8D91D3";
// const buttonInvokePrefix = "func";

// async function initRoleTable(dc: AuthDataContext) {
//     let count = await dc.roles.count();
//     if (count > 0)
//         return;

//     let adminRole: Role = {
//         id: adminRoleId,
//         name: "超级管理员",
//         remark: "系统预设的超级管理员",
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
// }

// async function initUserTable(dc: AuthDataContext, adminMobile: string, adminPassword) {
//     let count = await dc.users.count();
//     if (count > 0)
//         return;

//     let adminRole = await dc.roles.findOne(adminRoleId);

//     let admin: User = {
//         id: adminUserId,
//         mobile: adminMobile,
//         password: adminPassword,
//         user_name: "admin",
//         create_date_time: new Date(Date.now()),
//         is_system: true,
//         // role_id: adminRole.id
//     }

//     await dc.users.save(admin);

// }

// async function initResource(dc: AuthDataContext) {

// }


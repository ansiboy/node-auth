// import { connect, execute, guid } from "../database";
// import { errors } from "../errors";
// const tableName = 'permissions';
// export type ResourceAccess = 'Allow' | 'Deny'
// export type Resource = {
//     id: string,
//     name: string,
//     path: string,
//     create_date_time: Date,
//     appliation_id: string,
// }
// export type RoleResource = {
//     id: string,
//     resource_id: string,
//     role_id: string,
//     create_date_time: Date,
//     appliation_id: string,
// }
// export type Permission = {
//     id: string,
//     resources: Resource[],
//     application_id: string,
//     create_date_time: Date,
// }
// let defaultAccess: ResourceAccess = 'Allow';
// let allRoleResources: Resource[] = []
// export function savePermission(appId: string, permission: Permission) {
//     connect(conn => {
//         permission.resources = permission.resources || {} as any;
//         permission.resources = JSON.stringify(permission.resources) as any;
//         if (!permission.id)
//             return execute(conn, `insert into ${tableName} `)
//         return execute(conn, `update ${tableName} set resources ?`, JSON.stringify(permission.resources));
//     })
// }
// export function addRoleResource(appId: string, roleId: string, resourceId: string) {
//     if (roleId == null) throw errors.argumentNull('roleId')
//     if (name == null) throw errors.argumentNull('name')
//     if (resourceId == null) throw errors.argumentNull('resourceId')
//     connect(async conn => {
//         let sql = `insert into ${tableName} set ?`
//         let obj: RoleResource = {
//             id: guid(), create_date_time: new Date(Date.now()),
//             appliation_id: appId, resource_id: resourceId, role_id: roleId
//         }
//         return execute(conn, sql, obj)
//     })
// }
// export function removeRoleResource(appId: string, roleId: string, resourceId: string) {
//     if (roleId == null) throw errors.argumentNull('roleId')
//     if (name == null) throw errors.argumentNull('name')
//     if (resourceId == null) throw errors.argumentNull('resourceId')
//     connect(async conn => {
//         let sql = `delete ${tableName} where role_id = ? and resource_id = ? and application_id = ?`
//         return execute(conn, sql, [roleId, resourceId, appId])
//     })
// }
// export async function getPermission(appId: string): Promise<Permission> {
//     let items = await connect(async conn => {
//         let [rows, fields] = await execute(conn, `select * from ${tableName} where application_id = ?`, appId);
//         return rows[0];
//     })
//     return items;
// }
// export async function isAllowVisit(appId: string, userId: string, path: string) {
//     let permission = await getPermission(appId);
//     if (permission)
//         return defaultAccess;
//     return false;
// }
// export async function resources({ APP_ID }) {
//     let [rows] = await connect(async conn => {
//         let sql = `select * from resource order by sort_number`
//         if (APP_ID) {
//             sql = sql + ` where application_id = ?`
//         }
//         return execute(conn, sql, APP_ID)
//     })
//     return rows
// }
//# sourceMappingURL=permission.js.map
// import { controller, action, routeData } from "maishu-node-mvc";
// import { controllerPathRoot } from "../../permission/global";
// import { PermissionDataContext, permissionDataContext } from "../../permission/data-context";
// import { errors } from '../errors';

// @controller(`${controllerPathRoot}/menuItemRecord`)
// export class MenuItemRecordController {

//     @action()
//     async list(@permissionDataContext dc: PermissionDataContext) {
//         let r = await dc.menuItemRecords.find();
//         return r;
//     }

//     @action()
//     async set(@permissionDataContext dc: PermissionDataContext, @routeData { id, roleIds }: { id: string, roleIds: string[] }) {
//         if (!id) throw errors.routeDataFieldNull("id");
//         if (!roleIds) throw errors.routeDataFieldNull("roleIds");

//         let item = await dc.menuItemRecords.findOne(id);
//         if (item == null) {
//             await dc.menuItemRecords.insert({ id, roleIds: roleIds.join(","), create_date_time: new Date() });
//         }
//         else {
//             item.roleIds = roleIds.join(",");
//         }

//         return { id: item.id };
//     }

// }
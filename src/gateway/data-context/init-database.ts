import "reflect-metadata";
import { DataHelper, ConnectionOptions } from "maishu-node-data";
import { Role, UserRole } from "../entities";
import { roleIds, userIds } from "../global";
import { AuthDataContext } from "./data-context";

export async function initDatabase(connConfig: ConnectionOptions) {
    let dc = await AuthDataContext.create(connConfig);

    let adminRole: Role = {
        id: roleIds.admin,
        name: "管理员",
        remark: "系统预设的管理员",
        create_date_time: new Date(Date.now()),
    };

    await dc.roles.save(adminRole);

    let anonymousRole: Role = {
        id: roleIds.anonymous,
        name: "匿名用户组",
        remark: "系统预设的匿名用户组",
        create_date_time: new Date(Date.now()),
    }

    await dc.roles.save(anonymousRole);

    let normalUserRole: Role = {
        id: roleIds.normalUser,
        name: "普通用户",
        remark: "系统预设的普通用户组",
        create_date_time: new Date(Date.now()),
    }

    await dc.roles.save(normalUserRole);

    let stationRole: Role = {
        id: roleIds.station,
        name: "工作站",
        remark: "让其它系统调用本系统的接口",
        create_date_time: new Date(Date.now())
    }

    await dc.roles.save(stationRole);

    let userRole: UserRole = {
        user_id: userIds.admin,
        role_id: roleIds.admin,
    }

    await dc.userRoles.save(userRole);
}

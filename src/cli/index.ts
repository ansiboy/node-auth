#!/usr/bin/env node

import * as yargs from "yargs";
import * as inquirer from "inquirer";
import { createDataContext } from "../user";
import config from "../config";
import { guid } from "maishu-toolkit";
import { DataHelper } from "maishu-node-data";
import { UserDataContext } from "../user/data-context";
import { AuthDataContext, initDatabase } from "../gateway/data-context";
import * as md5 from "js-md5";
import { format } from "mysql";
import { UserRole } from "../gateway/entities";
import { roleIds } from "../gateway";

const options = yargs
    .command("p", "设置管理员密码", () => { }, setAdminPassword)
    .command("d", "设置数据库，支持 MySQL 和 SQLite，默认为 SQLite")
    .argv;


async function setAdminPassword() {
    const password = require("@inquirer/password");
    let firstPassword = await password({ message: "请输入管理密码", mask: "*" });
    let secondPassword = await password({ message: "请再次输入密码", mask: "*" });
    if (firstPassword != secondPassword) {
        console.log("设置密码失败，两次输入密码不同");
        return;
    }

    var userDC = await DataHelper.createDataContext(UserDataContext, config.db.permission);
    var gatewayDC = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);

    let roles = await gatewayDC.roles.find();
    if (roles.length == 0) {
        await initDatabase(config.db.gateway);
    }

    var adminUser = await userDC.users.findOne({ user_name: "admin" });
    if (adminUser == null) {
        adminUser = {
            id: roleIds.admin, password: md5(firstPassword), user_name: "admin",
            create_date_time: new Date(Date.now()),
        };
        userDC.users.save(adminUser);

        let userRole: UserRole = await gatewayDC.userRoles.findOne({ user_id: adminUser.id, role_id: roleIds.admin });
        if (!userRole) {
            userRole = { user_id: adminUser.id, role_id: roleIds.admin };
            await gatewayDC.userRoles.save<UserRole>(userRole);
        }
    }
    console.log("设置密码成功");
    return;
}
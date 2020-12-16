#!/usr/bin/env node

import * as yargs from "yargs";
import { DataHelper, ConnectionOptions } from "maishu-node-data";
import { UserDataContext } from "../user/data-context";
import { AuthDataContext } from "../gateway/data-context";
import { initDatabase } from "../gateway/data-context/init-database";
import * as md5 from "js-md5";
import { UserRole } from "../gateway/entities";
import { roleIds } from "../gateway/global";
import * as inquirer from "inquirer";
import * as colors from "colors";
import { Config } from "../config";
import { gateway } from "json!websiteConfig";
import * as fs from "fs";
import * as path from "path";

const EMPTY_FUNC = () => { };
const options = yargs
    .command("p", "设置管理员密码", EMPTY_FUNC, setAdminPassword)
    .command(["admin", "$0"], "更新管理员信息", EMPTY_FUNC, setAdmin,)
    .command("database", "创建数据库，支持 MySQL 和 SQLite，默认为 SQLite", EMPTY_FUNC, setDatabasae)
    .command("install", "安装系统，对系统进行初始化", EMPTY_FUNC, install)
    .demandCommand()
    .argv;

function main(args: typeof options) {

}

let config = getConfig();
const configFilePath = path.join(__dirname, "../../config.json");

async function setDatabasae() {
    const dbTypes = {
        sqlite: "sqlite",
        mysql: "mysql"
    }
    let { dbType } = await inquirer.prompt({
        type: "list", name: "dbType", message: "请选择数据库类型",
        choices: [dbTypes.sqlite, dbTypes.mysql]
    });

    switch (dbType) {
        case dbTypes.sqlite:
            break;
        case dbTypes.mysql:
            let { host } = await inquirer.prompt({ type: "input", message: "请输入数据库地址", name: "host", default: "127.0.0.1" });
            let { port } = await inquirer.prompt({ type: "input", message: "请输入端口", name: "port", default: "3306", });
            let { username } = await inquirer.prompt({ type: "input", message: "请输入用户名", name: "username", default: "root" });
            let { password } = await inquirer.prompt({ type: "input", message: "请输入密码", name: "password" });

            config.db = {
                gateway: { type: "mysql", host, port, username, password, database: "node_auth_gateway", debug: null },
                permission: { type: "mysql", host, port, username, password, database: "node_auth_gateway", debug: null },
            };

            await initDatabase(config.db.gateway);

            fs.writeFileSync(path.join(__dirname, "../../config.json"), JSON.stringify(config, null, "    "));

            console.log(colors.green("创建数据库成功").bold);
            break;
    }
}

function getConfig(): Config {
    if (fs.existsSync(configFilePath) == false)
        return {} as Config;

    let obj = JSON.parse(fs.readFileSync(configFilePath).toString());
    return obj;
}

async function install() {
    return setDatabasae().then(() => setAdmin());
}



async function setAdmin() {
    const fields = { password: "登录密码", phone: "手机号码" };
    inquirer
        .prompt({
            type: "list", name: "field", message: "请选择要修改的管理员信息",
            choices: [fields.password, fields.phone],
        })
        .then(answers => {
            switch (answers.field) {
                case fields.password:
                    return setAdminPassword();
                case fields.phone:
                    return setAdminPhone();
            }
        })
}

async function setAdminPhone() {
    inquirer.prompt({
        type: "input",
        message: "请输入手机号码",
        name: "mobile"
    }).then(async answers => {

        let userDC = await DataHelper.createDataContext(UserDataContext, config.db.permission);
        let gatewayDC = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);
        let adminUser = await getAdminAccount(userDC, gatewayDC);
        adminUser.mobile = answers.mobile;
        userDC.users.save(adminUser);

        console.log(colors.green("修改手机号码成功").bold);
    })
}

async function setAdminPassword() {
    const password = require("@inquirer/password");
    let firstPassword = await password({ message: "请输入管理密码", mask: "*" });
    let secondPassword = await password({ message: "请再次输入密码", mask: "*" });
    if (firstPassword != secondPassword) {
        console.log(colors.red("设置密码失败，两次输入密码不同").bold);
        return;
    }

    var userDC = await DataHelper.createDataContext(UserDataContext, config.db.permission);
    var gatewayDC = await DataHelper.createDataContext(AuthDataContext, config.db.gateway);

    let roles = await gatewayDC.roles.find();
    if (roles.length == 0) {
        await initDatabase(config.db.gateway);
    }

    var adminUser = await getAdminAccount(userDC, gatewayDC);
    adminUser.password = md5(firstPassword);
    await userDC.users.save(adminUser);

    console.log(colors.green("设置密码成功").bold);
    return;
}

async function getAdminAccount(userDC: UserDataContext, gatewayDC: AuthDataContext) {
    var adminUser = await userDC.users.findOne({ user_name: "admin" });
    if (adminUser == null) {
        adminUser = {
            id: roleIds.admin, password: "", user_name: "admin",
            create_date_time: new Date(Date.now()),
        };
        userDC.users.save(adminUser);

        let userRole: UserRole = await gatewayDC.userRoles.findOne({ user_id: adminUser.id, role_id: roleIds.admin });
        if (!userRole) {
            userRole = { user_id: adminUser.id, role_id: roleIds.admin };
            await gatewayDC.userRoles.save<UserRole>(userRole);
        }
    }

    return adminUser;
}
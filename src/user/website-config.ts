/// <reference path="./declare.ts"/>

import { roleIds } from "./global";
import md5 = require("js-md5");
import { WebsiteConfig } from "maishu-chitu-admin";

export let adminMobile = "18502146746";
export let adminPassword = md5("11");

// export type PermissionWebsiteConfig = {
//     stationPath: string,
//     gateway?: string,
//     gatewayStaionPath: string,
//     loginRedirectURL?: string,
// } & WebsiteConfig

let websiteConfig: WebsiteConfig = {
    // stationPath: stationPath,
    // gatewayStaionPath: gatewayStaionPath,
    // loginRedirectURL: "index",
    menuItems: [
        { id: "D0C0E4A1-B74F-4BE6-99EC-10B247130CAE", name: "用户", path: "#user-list", icon: "icon-group", sortNumber: 300 },
        {
            id: "F24F018C-01E8-47A9-B6F8-BE811FBD2ED9", name: "个人", icon: "icon-user", sortNumber: 400,
            children: [
                { id: "05E59FFA-6A66-42DA-B6BB-B00AA96E6C4F", name: "修改手机号", icon: "icon-tablet", path: "#personal/change-mobile" },
                { id: "179E6DDB-D6D9-4878-8CBE-25DAFCF676DC", name: "修改密码", icon: "icon-key", path: "#personal/change-password" }
            ]
        },
    ]
}

let stack = [...websiteConfig.menuItems];
while (stack.length > 0) {
    let item = stack.shift();
    item.roleIds = [roleIds.admin];
    (item.children || []).forEach(child => {
        stack.unshift(child);
    })
}

export default websiteConfig;
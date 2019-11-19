import { WebsiteConfig } from "maishu-chitu-admin";
import { stationPath, roleIds, settings } from "./global";
import md5 = require("js-md5");
import { stationPath as gatewayStaionPath } from "../gateway";

export let adminMobile = "18502146746";
export let adminPassword = md5("11");

let websiteConfig: WebsiteConfig & WebsiteConfigExt = {
    stationPath: stationPath,
    gatewayStaionPath: gatewayStaionPath,
    loginRedirectURL: "index",
    menuItems: [
        { id: "D0C0E4A1-B74F-4BE6-99EC-10B247130CAE", name: "用户管理", path: "#user/list", icon: "icon-group" },
        {
            id: "452624F3-3B29-4972-AF9C-B4CD64BD3DA2", name: "权限管理", icon: "icon-lock", children: [
                { id: "2EFE91D5-DBB1-4CC9-B943-A81CE3AF4271", name: "角色管理", icon: "icon-sitemap", path: "#role/list" },
                { id: "B06EFFA1-B224-4E14-96D6-45F980634394", name: "菜单管理", icon: "icon-tasks", path: "#menu/list" },
                { id: "DC10D377-40F9-4EFD-8F9C-147F486104EF", name: "令牌管理", icon: "icon-magic", path: "#token/list" },
                // { id: "E79CB245-DA53-4078-997E-C061F115F2CA", name: "API 设置", icon: "icon-rss", path: "#path/list" }
            ]
        },
        {
            id: "F24F018C-01E8-47A9-B6F8-BE811FBD2ED9", name: "个人中心", icon: "icon-user", children: [
                { id: "05E59FFA-6A66-42DA-B6BB-B00AA96E6C4F", name: "修改手机号", icon: "icon-tablet", path: "#personal/change-mobile" },
                { id: "179E6DDB-D6D9-4878-8CBE-25DAFCF676DC", name: "修改密码", icon: "icon-key", path: "#personal/change-password" }
            ]
        },
    ],
    requirejs: {

    }
}

let stack = [...websiteConfig.menuItems];
while (stack.length > 0) {
    let item = stack.shift();
    item.roleIds = [roleIds.adminRoleId];
    (item.children || []).forEach(child => {
        stack.unshift(child);
    })
}

export default websiteConfig;
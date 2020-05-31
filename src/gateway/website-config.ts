
import { WebsiteConfig } from "maishu-chitu-admin";
import { roleIds } from "./global";

let websiteConfig: WebsiteConfig = {
    menuItems: [
        // { id: "BBBBE4A1-B74F-4BE6-99EC-10B247130CAE", name: "TTT", path: "#user/list", icon: "icon-group", roleIds: [roleIds.admin] },
        {
            id: "G52624F3-3B29-4972-AF9C-B4CD64BD3DA2", name: "权限管理", icon: "icon-lock", roleIds: [roleIds.admin],
            children: [
                { id: "GEFE91D5-DBB1-4CC9-B943-A81CE3AF4271", name: "角色管理", icon: "icon-sitemap", path: "#role-list", roleIds: [roleIds.admin] },
                { id: "G06EFFA1-B224-4E14-96D6-45F980634394", name: "菜单管理", icon: "icon-tasks", path: "#menu-list", roleIds: [roleIds.admin] },
                { id: "GC10D377-40F9-4EFD-8F9C-147F486104EF", name: "令牌管理", icon: "icon-magic", path: "#token-list", roleIds: [roleIds.admin] },
            ]
        },
    ]
}


export default websiteConfig;

import { WebsiteConfig } from "maishu-chitu-admin";
import { roleIds } from "./global";

let websiteConfig: WebsiteConfig = {
    menuItems: [
        { id: "FBDA0ADA-9493-4CAF-842F-11C5B0A71111", name: "首页", icon: "icon-home", roleIds: [roleIds.admin], path: "#index", sortNumber: 100 },
        {
            id: "G52624F3-3B29-4972-AF9C-B4CD64BD3DA2", name: "权限", icon: "icon-lock", roleIds: [roleIds.admin], sortNumber: 200,
            children: [
                { id: "GEFE91D5-DBB1-4CC9-B943-A81CE3AF4271", name: "角色", icon: "icon-sitemap", path: "#role-list", roleIds: [roleIds.admin] },
                { id: "G06EFFA1-B224-4E14-96D6-45F980634394", name: "菜单", icon: "icon-tasks", path: "#menu-list", roleIds: [roleIds.admin] },
                { id: "GC10D377-40F9-4EFD-8F9C-147F486104EF", name: "令牌", icon: "icon-magic", path: "#token-list", roleIds: [roleIds.admin] },
            ]
        },
        { id: "49927614-2DB0-4CB5-9720-BD96DDE32469", name: "站点", icon: " icon-laptop", path: "#station-list", roleIds: [roleIds.admin], sortNumber: 1000 }
    ]
}

export default websiteConfig;
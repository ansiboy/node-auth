
import { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";
export { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";

let roleIds = {
    /** 管理员角色 ID */
    admin: "535e89a2-5b17-4e65-fecb-0259015b1a9b",
    /** 匿名角色 ID */
    anonymous: "738FB92C-60CF-4280-B5AE-61C376D0AADF",
    /** 普通用户 ID */
    normalUser: "516A72A0-21AE-4551-8A38-96EDAB0FAA5F",
    /** 工作站 */
    station: "C60AD2CC-485C-4169-88C0-48AC87FC4800",
}


let w: WebsiteConfig = {
    requirejs: {
        paths: {
            "js-md5": "node_modules/js-md5/src/md5",
            "maishu-dilu-react": "node_modules/maishu-dilu-react/dist/index",
            "maishu-data-page": "node_modules/maishu-data-page/dist/index.min",
            "maishu-chitu-admin/static": "node_modules/maishu-chitu-admin/dist/static",
        }
    },
    menuItems: [
        { id: "FBDA0ADA-9493-4CAF-842F-11C5B0A71111", name: "首页", icon: "fa fa-home", roleIds: [roleIds.admin], path: "#index", sortNumber: 100 },
        {
            id: "G52624F3-3B29-4972-AF9C-B4CD64BD3DA2", name: "权限", icon: "fa fa-lock", roleIds: [roleIds.admin], sortNumber: 200,
            children: [
                { id: "GEFE91D5-DBB1-4CC9-B943-A81CE3AF4271", name: "角色", icon: "fa fa-sitemap", path: "#role-list", roleIds: [roleIds.admin] },
                { id: "G06EFFA1-B224-4E14-96D6-45F980634394", name: "菜单", icon: "fa fa-tasks", path: "#menu-list", roleIds: [roleIds.admin] },
                { id: "GC10D377-40F9-4EFD-8F9C-147F486104EF", name: "令牌", icon: "fa fa-magic", path: "#token-list", roleIds: [roleIds.admin] },
            ]
        },
        { id: "49927614-2DB0-4CB5-9720-BD96DDE32469", name: "站点", icon: "fa fa-laptop", path: "#station-list", roleIds: [roleIds.admin], sortNumber: 1000 },
        { id: "D0C0E4A1-B74F-4BE6-99EC-10B247130CAE", name: "用户", path: "#/user/user-list", icon: "fa fa-group", sortNumber: 300 },
        {
            id: "F24F018C-01E8-47A9-B6F8-BE811FBD2ED9", name: "个人", icon: "fa fa-user", sortNumber: 400,
            children: [
                { id: "05E59FFA-6A66-42DA-B6BB-B00AA96E6C4F", name: "修改手机号", icon: "fa fa-tablet", path: "#/user/personal/change-mobile" },
                { id: "179E6DDB-D6D9-4878-8CBE-25DAFCF676DC", name: "修改密码", icon: "fa fa-key", path: "#/user/personal/change-password" }
            ]
        },
    ],
    mode: "production",
}

export default w;
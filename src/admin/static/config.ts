import { WebSiteConfig } from "maishu-chitu-admin/static";
let config = Object.assign(
    {
        menuItems: [
            { name: "用户管理", path: "#user/list", icon: "icon-group" },
            {
                name: "权限管理", icon: "icon-lock", children: [
                    { name: "角色管理", icon: "icon-sitemap", path: "#role/list" },
                    { name: "菜单管理", icon: "icon-tasks", path: "#menu/list" },
                    { name: "令牌管理", icon: "icon-magic", path: "#token/list" },
                    { name: "API 设置", icon: "icon-rss", path: "#path/list" }
                ]
            },
            {
                name: "个人中心", icon: "icon-user", children: [
                    { name: "修改手机号", icon: "icon-tablet", path: "#personal/change-mobile" },
                    { name: "修改密码", icon: "icon-key", path: "#personal/change-password" }
                ]
            },
        ]
    } as WebSiteConfig,
    {
        loginRedirectURL: "index",
        permissionServiceUrl: "http://127.0.0.1:2858/auth"
    }
)

export default config;
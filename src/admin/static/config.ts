import { WebSiteConfig } from "maishu-chitu-admin/static";

export let config = {
    // firstPanelWidth: 130,
    // secondPanelWidth: 130,
    loginRedirectURL: "index",
    // logoutRedirectURL: "",
    // registerRedirectURL: "",
    // login: {
    //     title: "好易权限管理系统",
    //     showForgetPassword: true,
    //     showRegister: true,
    // },
}

// let c = {}
// export default c;

export default {
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
        { name: "个人中心", icon: "icon-user" },
    ]
} as WebSiteConfig

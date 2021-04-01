import md5 = require("js-md5");
import { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";

export { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";
export let adminMobile = "18502146746";
export let adminPassword = md5("11");

// export type PermissionWebsiteConfig = {
//     stationPath: string,
//     gateway?: string,
//     gatewayStaionPath: string,
//     loginRedirectURL?: string,
// } & WebsiteConfig

let w: WebsiteConfig = {
    // stationPath: stationPath,
    // gatewayStaionPath: gatewayStaionPath,
    // loginRedirectURL: "index",
    requirejs: {
        paths: {
            "css": "node_modules/maishu-requirejs-plugins/src/css",
            "text": "node_modules/maishu-requirejs-plugins/lib/text",
            "json": "node_modules/maishu-requirejs-plugins/src/json",

            "react": "node_modules/react/umd/react.development",
            "react-dom": "node_modules/react-dom/umd/react-dom.development",
            "maishu-chitu": "node_modules/maishu-chitu/dist/index.min",
            "maishu-chitu-react": "node_modules/maishu-chitu-react/dist/index.min",
            "maishu-chitu-service": "node_modules/maishu-chitu-service/dist/index.min",
            "maishu-dilu": "node_modules/maishu-dilu/dist/index.min",
            "maishu-toolkit": "node_modules/maishu-toolkit/dist/index.min",
            "maishu-ui-toolkit": "node_modules/maishu-ui-toolkit/dist/index.min",
            "maishu-wuzhui": "node_modules/maishu-wuzhui/dist/index.min",
            "maishu-wuzhui-helper": "node_modules/maishu-wuzhui-helper/dist/index.min",
            "maishu-chitu-admin/static": "node_modules/maishu-chitu-admin/dist/static.min",
            "maishu-data-page": "node_modules/maishu-data-page/dist/index.min",
        }
    },
    menuItems: [
        { id: "D0C0E4A1-B74F-4BE6-99EC-10B247130CAE", name: "用户", path: "#user-list", icon: "icon-group", sortNumber: 300 },
        {
            id: "F24F018C-01E8-47A9-B6F8-BE811FBD2ED9", name: "个人", icon: "icon-user", sortNumber: 400,
            children: [
                { id: "05E59FFA-6A66-42DA-B6BB-B00AA96E6C4F", name: "修改手机号", icon: "icon-tablet", path: "#personal/change-mobile" },
                { id: "179E6DDB-D6D9-4878-8CBE-25DAFCF676DC", name: "修改密码", icon: "icon-key", path: "#personal/change-password" }
            ]
        },
    ],

}

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


let stack = [...w.menuItems];
while (stack.length > 0) {
    let item = stack.shift();
    item.roleIds = [roleIds.admin];
    (item.children || []).forEach(child => {
        stack.unshift(child);
    })
}

export default w;
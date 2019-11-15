import { Settings } from "./types";

//==============================================
export let PROJECt_NAME = "node-auth-permission";
export let controllerPathRoot = "permission";
export let stationPath = "/permission/";
export let gateway = "127.0.0.1:2857";
//==============================================

let settingsExt = {
    mobile: '18502146746',
    sendMessage: true,
    verifyCodeText: {
        default: '【百伦美】您的验证码是{0}',
        // register: '欢迎关注零食有约，您的验证码是{0}【零食有约】',
        // changeMobile: '您正在修改手机号，验证码是{0}【零食有约】',
        // receivePassword: '您正在修改密码，验证码是{0}【零食有约】'
    },

    /** 测试配置: 将 mobile 设为某个号码，则短信往该号码发，以方便测试 */
    test: {
        mobile: '18502146746',
        sendMessage: true,
    }
}
export let settings = settingsExt as Settings & typeof settingsExt;
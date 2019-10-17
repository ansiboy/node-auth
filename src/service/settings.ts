import { ConnectionConfig } from "mysql";

//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================
export let bindIP = '0.0.0.0';
//===========================================
// 机器名称，用于集群，让客户端知道是哪台机器
export const MACHINE_NAME = 'local-pc';

export let port = 2856;
export let redirectInfos = {
    pathInfos: [
        { rootDir: 'app', targetUrl: `http://${target_host}:2893` },
        { rootDir: 'admin', targetUrl: `http://${target_host}:2894` },
        { rootDir: 'msg', targetUrl: `http://${target_host}:2895` },
        { rootDir: 'distributor', targetUrl: `http://${target_host}:2896` },
        { rootDir: 'tool', targetUrl: `http://${target_host}:2897` },

        { rootDir: 'image', targetUrl: `http://${target_host}:48628` },
    ]
}

export const verifyCodeText = {
    default: '【百伦美】您的验证码是{0}',
    // register: '欢迎关注零食有约，您的验证码是{0}【零食有约】',
    // changeMobile: '您正在修改手机号，验证码是{0}【零食有约】',
    // receivePassword: '您正在修改密码，验证码是{0}【零食有约】'
}

//====================================
// 测试配置
/** 将 mobile 设为某个号码，则短信往该号码发，以方便测试 */
export let test = {
    mobile: '18502146746',
    sendMessage: true,
}
//====================================
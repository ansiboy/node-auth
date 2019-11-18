import { Settings } from "./types";
export declare let PROJECt_NAME: string;
export declare let controllerPathRoot: string;
export declare let stationPath: string;
export declare let gateway: string;
export declare let roleIds: {
    adminRoleId: string;
    anonymousRoleId: string;
} & {
    normalUserRoleId: string;
};
export declare let settings: Settings & {
    mobile: string;
    sendMessage: boolean;
    verifyCodeText: {
        default: string;
    };
    /** 测试配置: 将 mobile 设为某个号码，则短信往该号码发，以方便测试 */
    test: {
        mobile: string;
        sendMessage: boolean;
    };
};

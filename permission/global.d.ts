import { ConnectionConfig } from "mysql";
export { roleIds } from "../gateway";
export declare let PROJECt_NAME: string;
export declare let controllerPathRoot: string;
export declare let stationPath: string;
export declare let smsSettings: {
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
export declare type ServerContextData = {
    sms: typeof smsSettings;
    db: ConnectionConfig;
};

import { ConnectionConfig } from "mysql";
export declare let bindIP: string;
export declare const MACHINE_NAME = "local-pc";
export declare const headers: {
    name: string;
    value: string;
}[];
export declare let allowHeaders: string;
export declare let conn: {
    auth: ConnectionConfig;
};
export declare function setConnection(value: ConnectionConfig): void;
export declare let port: number;
export declare let redirectInfos: {
    pathInfos: {
        rootDir: string;
        targetUrl: string;
    }[];
};
export declare const verifyCodeText: {
    default: string;
};
/** 将 mobile 设为某个号码，则短信往该号码发，以方便测试 */
export declare let test: {
    mobile: string;
    sendMessage: boolean;
};

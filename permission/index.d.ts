import { Settings as BaseSettings } from "maishu-chitu-admin";
import { smsSettings } from "./global";
import { ConnectionConfig } from "mysql";
export { createDataContext } from "./data-context";
export { roleIds } from "./global";
declare type InnerSettings = Pick<BaseSettings, "rootDirectory" | "station" | "serverContextData">;
export declare type Settings = Pick<BaseSettings, Exclude<keyof BaseSettings, keyof InnerSettings>> & {
    gateway: string;
    db: ConnectionConfig;
    sms?: typeof smsSettings;
};
export declare function start(settings: Settings): Promise<any>;

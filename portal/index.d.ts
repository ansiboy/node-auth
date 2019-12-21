import { Settings as BaseSettings } from "maishu-chitu-admin";
declare type InnerSettings = Pick<BaseSettings, "rootDirectory" | "station" | "serverContextData">;
export declare type Settings = Pick<BaseSettings, Exclude<keyof BaseSettings, keyof InnerSettings>> & {
    port: number;
    gateway: string;
    indexPage?: string;
    virtualPaths?: {
        [path: string]: string;
    };
    mode?: "development" | "production";
};
export declare function start(settings: Settings): void;
export {};

export declare type Settings = {
    port: number;
    gateway: string;
    indexPage?: string;
    virtualPaths?: {
        [path: string]: string;
    };
};
export declare function start(settings: Settings): void;

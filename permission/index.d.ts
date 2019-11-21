/// <reference types="node" />
import { Settings } from "./types";
export { Settings } from "./types";
export { createDataContext } from "./data-context";
export { roleIds } from "./global";
export declare function start(settings: Settings): Promise<{
    server: import("http").Server;
}>;

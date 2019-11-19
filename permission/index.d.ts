/// <reference types="node" />
import { Settings } from "./types";
export { Settings } from "./types";
export { createDataContext } from "./data-context";
export declare function start(settings: Settings): {
    server: import("http").Server;
};

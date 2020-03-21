import { StationInfo } from "../types";
export declare class StationController {
    list(): {
        path: string;
    }[];
    /** 注册站点 */
    register(data: StationInfo): void;
}

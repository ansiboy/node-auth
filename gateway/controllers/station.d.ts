import { StationInfo, ServerContextData } from "../types";
export declare class StationController {
    list(): {
        path: string;
    }[];
    /** 注册站点 */
    register(data: StationInfo, contextData: ServerContextData): void;
}

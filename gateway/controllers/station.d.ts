import { StationInfo, ServerContextData } from "../types";
export declare class StationController {
    list(): any;
    /** 注册站点 */
    register(data: StationInfo, contextData: ServerContextData): void;
}

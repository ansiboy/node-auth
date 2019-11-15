import { StationInfo } from "../types";
export declare class StationController {
    list(): {
        path: string;
    }[];
    register(data: StationInfo): void;
}

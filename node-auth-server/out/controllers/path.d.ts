import { AuthDataContext } from "../dataContext";
import { Path } from "../entities";
export declare class PathController {
    list(dc: AuthDataContext, { resourceId }: {
        resourceId: string;
    }): Promise<Path[]>;
    listByResourceIds(dc: AuthDataContext, { resourceIds }: {
        resourceIds: string[];
    }): Promise<Path[]>;
}

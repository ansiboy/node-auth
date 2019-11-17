import { PermissionDataContext } from "../data-context";
import { Path } from "../entities";
export declare class PathController {
    list(dc: PermissionDataContext, { resourceId }: {
        resourceId: string;
    }): Promise<Path[]>;
    listByResourceIds(dc: PermissionDataContext, { resourceIds }: {
        resourceIds: string[];
    }): Promise<Path[]>;
}

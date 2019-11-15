import { Resource, User } from "../entities";
import { AuthDataContext } from "../data-context";
/** 资源控制器 */
export default class ResourceController {
    add(dc: AuthDataContext, user: User, { item }: {
        item: Resource;
    }): Promise<Partial<Resource>>;
    update(dc: AuthDataContext, { item }: {
        item: Resource;
    }): Promise<{
        id: string;
    }>;
    remove(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<{
        id: any;
    }>;
    list(dc: AuthDataContext): Promise<Resource[]>;
    item(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Resource>;
    set(dc: AuthDataContext, { resourceId, paths }: {
        resourceId: string;
        paths: string[];
    }): Promise<void>;
}

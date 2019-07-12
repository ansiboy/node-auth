import { Resource, User } from "../entities";
import { AuthDataContext } from "../dataContext";
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
    list(dc: AuthDataContext, user: User): Promise<Resource[]>;
    item(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Resource>;
}

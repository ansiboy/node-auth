import * as mysql from 'mysql';
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
    remove(conn: mysql.Connection, { id }: {
        id: any;
    }): Promise<void>;
    list(dc: AuthDataContext, user: User): Promise<Resource[]>;
    item(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Resource>;
}

import * as db from 'maishu-mysql-helper';
import * as mysql from 'mysql';
import { Resource } from "../entities";
import { AuthDataContext } from "../dataContext";
export default class ResourceController {
    add(conn: mysql.Connection, { item }: {
        item: Resource;
    }): Promise<{
        id: string;
    }>;
    update(conn: mysql.Connection, { item }: {
        item: Resource;
    }): Promise<{
        id: string;
    }>;
    remove(conn: mysql.Connection, { id }: {
        id: any;
    }): Promise<void>;
    list(conn: mysql.Connection, { args }: {
        args: db.SelectArguments;
    }): Promise<db.SelectResult<Resource>>;
    item(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Resource>;
}

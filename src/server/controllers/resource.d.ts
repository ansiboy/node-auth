import * as db from 'maishu-mysql-helper';
import * as mysql from 'mysql';
interface Resource {
    id?: string;
    name: string;
    path?: string;
    parent_id: string;
    sort_number: number;
    type: string;
    create_date_time: Date;
    data?: object;
}
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
}
export {};

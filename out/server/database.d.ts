import * as mysql from 'mysql';
import { SelectArguments, SelectResult } from 'maishu-mysql-helper';
export declare let connection: (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function connect<T>(callback: (collection: mysql.Connection) => Promise<T>): Promise<T>;
export declare function execute(conn: mysql.Connection, sql: string, value?: any): Promise<[any[], mysql.FieldInfo[]]>;
export declare function guid(): string;
export declare function list<T>(conn: mysql.Connection, tableName: string, args?: SelectArguments): Promise<SelectResult<T>>;
export declare function select<T>(conn: mysql.Connection, tableName: string, args?: SelectArguments): Promise<T[]>;
export declare function update<T extends {
    id: string;
}>(conn: mysql.Connection, tableName: string, item: Partial<T>): Promise<void | T>;
export declare function executeSQL(conn: mysql.Connection, sql: string, values: any): Promise<unknown>;
export declare function get<T>(conn: mysql.Connection, tableName: any, filter: Partial<T>): Promise<T>;
export declare function insert<T extends {
    id: string;
}>(conn: mysql.Connection, tableName: string, item: T): Promise<any>;

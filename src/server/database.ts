import * as mysql from 'mysql';
import * as settings from './settings';
import { createParameterDecorator } from 'maishu-node-mvc';
import { SelectArguments, SelectResult, Parser } from 'maishu-mysql-helper';
import { errors } from './errors';

export let connection = createParameterDecorator(
    async () => {
        let conn = mysql.createConnection(settings.conn.auth)
        return conn
    },
    (conn) => {
        console.assert(conn != null)
        conn.end()
    }
)

export function connect<T>(callback: (collection: mysql.Connection) => Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
        let conn = mysql.createConnection(settings.conn.auth);
        callback(conn)
            .then((result) => {
                conn.end();
                resolve(result);
            })
            .catch(err => {
                conn.end();
                reject(err);
            });
    });
}

export function execute(conn: mysql.Connection, sql: string, value?: any): Promise<[any[], mysql.FieldInfo[]]> {
    return new Promise((resolve, reject) => {
        conn.query(sql, value, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            if (Array.isArray(rows) && fields != null) {
                fields.forEach(field => {
                    if (field.type != mysql.Types.JSON)
                        return

                    rows.forEach(item => {
                        let value = item[field.name]
                        if (value != null)
                            item[field.name] = JSON.parse(value)
                    })
                })
            }

            resolve([rows, fields]);
        })
    });
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


export async function list<T>(conn: mysql.Connection, tableName: string, args?: SelectArguments): Promise<SelectResult<T>> {
    args = Object.assign({
        startRowIndex: 0, maximumRows: 100
    } as SelectArguments, args || {})

    if (args.filter) {
        let expr = Parser.parseExpression(args.filter);
        if (expr.type != "Binary") {
            // throw errors.parseFilterFail(args.filter)
            throw new Error('Parse filter fail')
        }
    }
    if (args.sortExpression) {
        let expr = Parser.parseOrderExpression(args.sortExpression);
        if (expr.type != "Order") {
            // throw errors.parseSortFail(args.sortExpression)
            throw new Error('Parse sort fail')
        }
    }
    else {
        args.sortExpression = 'create_date_time desc'
    }

    // if (conn.applicationId) {
    //     args.filter = args.filter ?
    //         `${args.filter} and application_id = '${conn.applicationId}'` :
    //         `application_id = '${conn.applicationId}'`
    // }

    let sql_filter = args.filter ? 'where ' + args.filter : ''
    let p1 = new Promise<T[]>((resolve, reject) => {
        let sql = `select * from ${tableName} ${sql_filter}
                   order by ${args.sortExpression}
                   limit ${args.maximumRows} offset ${args.startRowIndex}`;

        conn.query(sql, args, (err, rows: Array<any>, fields) => {
            if (err) {
                reject(err);
                return;
            }

            fields.forEach(field => {
                if (field.type != mysql.Types.JSON)
                    return

                rows.forEach(item => {
                    let value = item[field.name]
                    if (value != null)
                        item[field.name] = JSON.parse(value)
                })
            })

            resolve(rows);
        });
    })

    let p2 = new Promise<number>((resolve, reject) => {
        let sql = `select count(*) as count from ${tableName} ${sql_filter}`;
        conn.query(sql, args, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows[0].count);
        });
    })

    let r = await Promise.all([p1, p2]);
    let dataItems = r[0];
    let totalRowCount = r[1];

    return { dataItems, totalRowCount }

}

export async function select<T>(conn: mysql.Connection, tableName: string, args?: SelectArguments): Promise<T[]> {
    args = Object.assign({
        startRowIndex: 0, maximumRows: 100
    } as SelectArguments, args || {})

    if (args.filter) {
        let expr = Parser.parseExpression(args.filter);
        if (expr.type != "Binary") {
            // throw errors.parseFilterFail(args.filter)
            throw new Error('Parse filter fail')
        }
    }
    if (args.sortExpression) {
        let expr = Parser.parseOrderExpression(args.sortExpression);
        if (expr.type != "Order") {
            // throw errors.parseSortFail(args.sortExpression)
            throw new Error('Parse sort fail')
        }
    }

    return new Promise<T[]>((resolve, reject) => {
        let sql = `select * from ${tableName}`;
        if (args.filter) {
            sql = sql + ` where ${args.filter}`
        }
        if (args.sortExpression) {
            sql = sql + ` order by ${args.sortExpression}`
        }

        sql = sql + ` limit ${args.maximumRows} offset ${args.startRowIndex}`

        conn.query(sql, args, (err, rows: Array<any>, fields) => {
            if (err) {
                reject(err);
                return;
            }

            fields.forEach(field => {
                if (field.type != mysql.Types.JSON)
                    return

                rows.forEach(item => {
                    let value = item[field.name]
                    if (value != null)
                        item[field.name] = JSON.parse(value)
                })
            })

            resolve(rows);
        });
    })

}

export async function update<T extends { id: string }>(conn: mysql.Connection, tableName: string, item: Partial<T>) {
    if (!tableName) throw errors.argumentNull('tableName')
    if (!item) throw errors.argumentNull('item')
    if (!item.id) throw errors.argumentNull('item.id')


    let names = Object.getOwnPropertyNames(item)
    if (names.length == 0) {
        return Promise.resolve()
    }

    let values = []
    let sql = `update ${tableName} set ? where id = ?`;
    for (let i = 0; i < names.length; i++) {
        if (item[names[i]] != null && typeof item[names[i]] == 'object' && !(item[names[i]] instanceof Date)) {
            item[names[i]] = JSON.stringify(item[names[i]])
        }
    }

    values.push(item, item.id)

    if (item['create_date_time'])
        delete item['create_date_time']

    delete item.id
    return query<T>(conn, sql, values)
}

export async function executeSQL(conn: mysql.Connection, sql: string, values: any) {
    return new Promise((resolve, reject) => {
        conn.query(sql, values, (error, result, fields) => {
            if (error) {
                reject(error)
                return
            }

            resolve(result)
        })
    })
}

function query<T>(conn: mysql.Connection, options: any, values?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        conn.query(options, values, (error, result, fields) => {
            if (error) {
                reject(error)
                return
            }

            resolve(result)
        })
    })
}

export async function get<T>(conn: mysql.Connection, tableName, filter: Partial<T>): Promise<T> {
    if (!tableName) throw errors.argumentNull('tableName')
    if (!filter) throw errors.argumentNull('id')
    let text_filter = ''
    let names = Object.getOwnPropertyNames(filter)
    let values = []
    for (let i = 0; i < names.length; i++) {
        if (i == 0)
            text_filter = `${names[i]} = ?`
        else
            text_filter = `${text_filter} and ${names[i]} = ?`

        values.push(filter[names[i]])
    }
    let sql = `select * from ${tableName} where ${text_filter} limit 1`;
    return new Promise<T>((resolve, reject) => {
        conn.query(sql, values, (err, rows: Array<any>, fields) => {
            if (err) {
                reject(err)
                return
            }

            fields.forEach(field => {
                if (field.type != mysql.Types.JSON)
                    return

                rows.forEach(item => {
                    let value = item[field.name]
                    if (value != null)
                        item[field.name] = JSON.parse(value)
                })
            })

            resolve(rows[0]);
        });
    })
}

export async function insert<T extends { id: string }>(conn: mysql.Connection, tableName: string, item: T): Promise<any> {
    if (!tableName) throw errors.argumentNull('tableName')
    if (!item) throw errors.argumentNull('item')

    if (!item.id)
        item.id = guid()

    item['create_date_time'] = new Date(Date.now())
    let names = Object.getOwnPropertyNames(item)
    for (let i = 0; i < names.length; i++) {
        let name = names[i]
        let value = item[name]
        if (typeof value == "object" && !(value instanceof Date)) {
            item[name] = JSON.stringify(value)
        }
    }

    let sql = `insert into ${tableName} set ?`;
    return query<T>(conn, sql, item).then(() => {
        return {
            id: item.id,
            create_date_teim: item['create_date_time']
        }
    })
}


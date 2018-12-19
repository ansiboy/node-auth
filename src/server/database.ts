import * as mysql from 'mysql';
import * as settings from './settings';

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

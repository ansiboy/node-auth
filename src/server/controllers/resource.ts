import { connect, execute, guid } from "../database";
import { errors } from "../errors";
import { conn } from "../settings";

interface Resource {
    id?: string,
    name: string,
    path?: string,
    parent_id: string,
    sort_number: number,
    type: string,
    create_date_time: Date,
}

export async function add({ name, path, parent_id, sort_number, type }) {
    if (!name) throw errors.argumentNull('name')
    if (sort_number != null && typeof sort_number != 'number')
        throw errors.argumentTypeIncorrect('sort_number', 'number')

    let item: Resource = {
        id: guid(), name, path,
        parent_id, sort_number, create_date_time: new Date(Date.now()),
        type
    }

    await connect(async conn => {

        if (item.sort_number == null) {
            let s = `select max(sort_number) as value from resource`

            let rows: any[]
            if (type == null) {
                s = s + ` where type is null`;
                [rows] = await execute(conn, s)
            }
            else {
                s = s + ` where type = ?`;
                [rows] = await execute(conn, s, type)
            }

            console.log(rows)
            let max_sort_number = rows.length == 0 ? 0 : rows[0].value
            item.sort_number = max_sort_number + 10
        }

        let sql = `insert into resource set ?`
        return execute(conn, sql, item)
    })

    return { id: item.id }
}

export async function update({ id, name, path, parent_id, sort_number, type }) {
    if (!id) throw errors.argumentNull('id')
    if (!name) throw errors.argumentNull('name')

    let item: Resource = {
        name, path,
        parent_id, sort_number, create_date_time: new Date(Date.now()),
        type
    }

    await connect(async conn => {
        let sql = `update resource set ? where id = ?`
        return execute(conn, sql, [item, id])
    })

    return { id: item.id }
}

export async function remove({ id }) {
    if (!id) throw errors.argumentNull('id')

    let sql = `delete from resource where id = ?`
    await connect(async conn => {
        return execute(conn, sql, id)
    })
}

export async function list({ type }) {
    let [rows] = await connect(async conn => {
        let sql = `select * from resource`
        if (type) {
            sql = sql + ` where type = ?`
        }
        sql = sql + ' order by sort_number'
        return execute(conn, sql, type)
    })

    return rows
}


import { connect, execute, guid } from "../database";
import { errors } from "../errors";
import * as db from 'maishu-mysql-helper'
import { action } from "../controller";

interface Resource {
    id?: string,
    name: string,
    path?: string,
    parent_id: string,
    sort_number: number,
    type: string,
    create_date_time: Date,
    data?: object,
}

export default class ResourceController {

    @action()
    async add({ item }: { item: Resource }) {//name, path, parent_id, sort_number, type 
        if (!item.name) throw errors.fieldNull('name', 'item')
     
        item.id = guid()
        item.create_date_time = new Date(Date.now())

        await connect(async conn => {

            if (item.sort_number == null) {
                let s = `select max(sort_number) as value from resource`

                let rows: any[]
                if (item.type == null) {
                    s = s + ` where type is null`;
                    [rows] = await execute(conn, s)
                }
                else {
                    s = s + ` where type = ?`;
                    [rows] = await execute(conn, s, item.type)
                }

                console.log(rows)
                let max_sort_number = rows.length == 0 ? 0 : rows[0].value
                item.sort_number = max_sort_number + 10
            }

            if (item.data && typeof item.data == 'object')
                item.data = JSON.stringify(item.data) as any

            let sql = `insert into resource set ?`
            return execute(conn, sql, item)
        })

        return { id: item.id }
    }

    @action()
    async update({ item, conn }: { item: Resource, conn: db.Connection }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.id) throw errors.fieldNull('id', 'item')

        await db.update(conn, 'resource', item)
        return { id: item.id }
    }

    @action()
    async remove({ id }) {
        if (!id) throw errors.argumentNull('id')

        let sql = `delete from resource where id = ?`
        await connect(async conn => {
            return execute(conn, sql, id)
        })
    }

    @action()
    async list({ args, conn }: { args: db.SelectArguments, conn: db.Connection }) {
        args = args || {}
        if (!args.sortExpression) {
            args.sortExpression = 'sort_number asc'
        }
        conn.applicationId = null
        let result = await db.list<Resource>(conn, 'resource', args)
        return result
    }

}
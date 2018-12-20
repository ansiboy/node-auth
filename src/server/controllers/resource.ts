import { connect, execute, guid } from "../database";
import { errors } from "../errors";
import { conn } from "../settings";
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
}

export default class ResourceController {

    async add({ name, path, parent_id, sort_number, type }) {
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

    async update({ id, name, path, parent_id, sort_number, type }) {
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

    async remove({ id }) {
        if (!id) throw errors.argumentNull('id')

        let sql = `delete from resource where id = ?`
        await connect(async conn => {
            return execute(conn, sql, id)
        })
    }

    @action()
    async list({ args, conn }: { args: db.SelectArguments, conn: db.Connection }) {
        if (!args.sortExpression) {
            args.sortExpression = 'sort_number asc'
        }
        let result = await db.list<Resource>(conn, 'resource', args)
        return result
    }

    async temp() {
        let conn = await db.getConnection()
        let resources = await db.list<Resource>(conn, 'resource')
        return resources
    }


}
import { connect, execute, guid, connection, update, list } from "../database";
import { errors } from "../errors";
import * as db from 'maishu-mysql-helper'
import { controller, formData, action } from "maishu-node-mvc";
import * as mysql from 'mysql'
import { Resource } from "../entities";
import { authDataContext, AuthDataContext } from "../dataContext";



@controller("resource")
export default class ResourceController {

    @action()
    async add(@connection conn: mysql.Connection, @formData { item }: { item: Resource }) {
        if (!item.name) throw errors.fieldNull('name', 'item')

        item.id = guid()
        item.create_date_time = new Date(Date.now())

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
        await execute(conn, sql, item)
        return { id: item.id }
    }

    @action()
    async update(@connection conn: mysql.Connection, @formData { item }: { item: Resource }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.id) throw errors.fieldNull('id', 'item')

        await update(conn, 'resource', item)
        return { id: item.id }
    }

    @action()
    async remove(@connection conn: mysql.Connection, @formData { id }) {
        if (!id) throw errors.argumentNull('id')

        let sql = `delete from resource where id = ?`;
        await execute(conn, sql, id)
    }

    @action()
    async list(@connection conn: mysql.Connection, @formData { args }: { args: db.SelectArguments }) {
        args = args || {}
        if (!args.sortExpression) {
            args.sortExpression = 'sort_number asc'
        }
        let result = await list<Resource>(conn, 'resource', args)
        return result
    }

    @action()
    async item(@authDataContext dc: AuthDataContext, @formData { id }) {
        if (!id) throw errors.fieldNull("id", "formData");

        let item = await dc.resources.findOne(id);
        return item;
    }

}
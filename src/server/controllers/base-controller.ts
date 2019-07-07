import { Controller } from "maishu-node-mvc";
import { SelectArguments, SelectResult } from "maishu-mysql-helper";
import { Repository } from "typeorm";

export interface SelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}

export interface SelectResult<T> {
    dataItems: T[];
    totalRowCount: number;
}

export class BaseController extends Controller {
    static async list<T>(r: Repository<T>, args?: SelectArguments, relations?: string[]): Promise<SelectResult<T>> {
        args = args || {};

        let order: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 };
        if (!args.sortExpression) {
            args.sortExpression = "create_date_time desc"
        }

        let arr = args.sortExpression.split(/\s+/).filter(o => o);
        console.assert(arr.length > 0)
        order = {};
        order[arr[0]] = arr[1].toUpperCase() as any;

        let [items, count] = await r.findAndCount({
            where: args.filter, relations,
            skip: args.startRowIndex,
            take: args.maximumRows,
            order: order
        });

        return { dataItems: items, totalRowCount: count } as SelectResult<T>
    }
}
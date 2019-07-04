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
    static async list<T>(r: Repository<T>, args?: SelectArguments): Promise<SelectResult<T>> {
        args = args || {};

        let q = r.createQueryBuilder();

        if (args.filter) {
            q = q.where(args.filter);
        }

        if (args.sortExpression) {
            let arr = args.sortExpression.split(/\s+/).filter(o => o);
            console.assert(arr.length > 0)
            q.orderBy(arr[0], arr[1].toUpperCase() as any);
        }

        if (args.maximumRows) {
            q = q.take(args.maximumRows);
        }

        if (args.startRowIndex) {
            q = q.skip(args.startRowIndex);
        }

        let items = await q.getMany();
        let count = await q.getCount();

        return { dataItems: items, totalRowCount: count } as SelectResult<T>
    }
}
import { Controller } from "maishu-node-mvc";
import { Repository } from "maishu-data";

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
    static async list<T>(repository: Repository<T>, options: {
        selectArguments?: SelectArguments, relations?: string[],
        fields?: Extract<keyof T, string>[]
    }): Promise<SelectResult<T>> {

        let { selectArguments, relations, fields } = options;
        selectArguments = selectArguments || {};

        let order: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 };
        if (!selectArguments.sortExpression) {
            selectArguments.sortExpression = "create_date_time desc"
        }

        let arr = selectArguments.sortExpression.split(/\s+/).filter(o => o);
        console.assert(arr.length > 0)
        order = {};
        order[arr[0]] = arr[1].toUpperCase() as any;

        let [items, count] = await repository.findAndCount({
            where: selectArguments.filter, relations,
            skip: selectArguments.startRowIndex,
            take: selectArguments.maximumRows,
            order: order,
            select: fields,

        });

        return { dataItems: items, totalRowCount: count } as SelectResult<T>
    }
}
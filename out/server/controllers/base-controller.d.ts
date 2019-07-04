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
export declare class BaseController extends Controller {
    static list<T>(r: Repository<T>, args?: SelectArguments): Promise<SelectResult<T>>;
}

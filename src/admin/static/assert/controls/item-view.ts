import { PageView, PageViewArguments } from "./page-view";
import { DataSource } from "maishu-wuzhui";

type ItemViewArguments<T> = {
    objectId: string,
    dataSource: DataSource<T>,
} & PageViewArguments

export class ItemView<T> extends PageView {
    constructor(args: ItemViewArguments<T>) {
        super(args)
    }
}
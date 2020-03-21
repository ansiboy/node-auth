import { BasePage } from "./base-page";
import { DataSource, DataControlField, GridView, CustomField } from "maishu-wuzhui";
import React = require("react");
import { Dialog } from "../item-dialog";
export declare abstract class DataListPage<T> extends BasePage {
    abstract dataSource: DataSource<T>;
    abstract itemName: string;
    abstract columns: DataControlField<T>[];
    protected translate?: (items: T[]) => T[];
    pageSize?: number;
    headerFixed: boolean;
    private itemTable;
    gridView: GridView<T>;
    dialog: Dialog<T>;
    operationColumn: CustomField<T>;
    constructor(props: any);
    componentDidMount(): void;
    renderEditor(): React.ReactElement;
    renderToolbarRight(): JSX.Element[];
    render(): JSX.Element;
}

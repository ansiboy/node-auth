import React = require("react");
import { MyDataSource } from "dataSources";
import { FormValidator } from 'maishu-dilu';
import { Page } from "maishu-chitu-react";
import { Application } from "maishu-chitu-admin";
interface State {
    dataItem: any;
    originalDataItem: any;
}
declare type BeforeSave = (dataItem: any) => Promise<any>;
export declare let ItemPageContext: React.Context<{
    dataItem: any;
    updatePageState: (dataItem: any) => any;
    beforeSave: (callback: BeforeSave) => any;
}>;
export interface ItemPageProps<T> {
    app: Application;
    source: Page;
    data: {
        id: string;
        sourceId: string;
        resourceId: string;
        objectType: string;
        mode?: string;
    };
    createService: Page["createService"];
    beforeSave?: (dataItem: T) => Promise<any>;
    afterGetItem?: (dataItem: T) => void;
}
export declare class ItemPage<T> extends React.Component<ItemPageProps<T>, State> {
    dataSource: MyDataSource<any>;
    fieldsConatiner: HTMLDivElement;
    validator: FormValidator;
    beforeSaves: BeforeSave[];
    constructor(props: any);
    loadDataItem(itemId: string): void;
    save(): Promise<never>;
    componentWillReceiveProps(props: this['props']): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};

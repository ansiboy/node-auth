import React = require("react");
import { DataSource, GridView, DataControlField } from "maishu-wuzhui";
import { Application, Page } from "maishu-chitu-react";
interface State {
    addButton?: JSX.Element;
    title?: string;
}
export interface ListPageProps {
    app: Application;
    data: {
        resourceId: string;
        objectType: string;
    };
    createService: Page["createService"];
    columns: DataControlField<any>[];
    showHeader?: boolean;
    pageSize?: number;
}
interface Props extends ListPageProps {
    search?: JSX.Element;
    right?: JSX.Element;
    dataSource: DataSource<any>;
}
export declare let ListPageContext: React.Context<{
    dataSource: DataSource<any>;
}>;
export declare class ListPage extends React.Component<Props, State> {
    dataSource: DataSource<any>;
    gridView: GridView<any>;
    table: any;
    constructor(props: ListPage['props']);
    loadResourceAddButton(): Promise<JSX.Element>;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
export {};

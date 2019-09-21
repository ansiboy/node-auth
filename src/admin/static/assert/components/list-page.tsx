import React = require("react");
import { DataSource, DataControlField, GridView } from "maishu-wuzhui";
import { PermissionService } from 'assert/services/index'
import { translateToMenuItems } from "assert/dataSources";
import { ListView } from "../controls/list-view";
import { constants } from "./constants";
import errorHandle from "error-handle";

interface State {
    buttons?: JSX.Element[],
    title?: string,
}

export interface ListPageProps<T> {
    right?: JSX.Element,
    context?: object,
    dataSource: DataSource<T>,
    resourceId: string,
    transform?: (items: T[]) => T[];
    columns: DataControlField<T>[],
    showHeader?: boolean,
    pageSize?: number,
}

export let ListPageContext = React.createContext<{ dataSource: DataSource<any> }>(null)

export class ListPage<T> extends React.Component<ListPageProps<T>, State> {
    ps: PermissionService;
    listView: ListView<T>;
    constructor(props: ListPage<T>['props']) {
        super(props);

        this.ps = new PermissionService((err) => errorHandle(err)); //this.props.createService(PermissionService);
    }

    get dataSource() {
        return this.props.dataSource;
    }

    get gridView(): GridView<T> {
        return this.listView.gridView;
    }

    render() {
        return <div ref={async e => {
            if (!e) return;

            let resources = await this.ps.resource.list();
            let menuItems = translateToMenuItems(resources);
            this.listView = new ListView<T>({
                element: e,
                dataSource: this.props.dataSource,
                columns: this.props.columns,
                menuItems,
                resourceId: this.props.resourceId,
                context: this.props.context,
                transform: this.props.transform,
                pageSize: this.props.pageSize === undefined ? constants.pageSize : this.props.pageSize,
            })

        }} />
    }
}


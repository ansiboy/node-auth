import React = require("react");
import { PermissionService } from "services/permission-service";
import { DataSource, GridView } from "maishu-wuzhui";
import { Resource } from "maishu-services-sdk";
import { ItemPageProps } from "../../data-component/index";
declare type Item = Resource & {
    children?: Item[];
    selected?: boolean;
};
interface State {
    title: string;
    platformSelectAll: boolean;
    distributorSelectAll: boolean;
}
export default class PermissionPage extends React.Component<ItemPageProps<Item>, State> {
    resourceTable: HTMLTableElement;
    gridView: GridView<Resource>;
    resources: Item[];
    dataSource: DataSource<Resource>;
    ps: PermissionService;
    constructor(props: any);
    selectAll(category: Resource['category'], checked: boolean): void;
    createDataSource(resources: Resource[]): Promise<DataSource<Resource>>;
    checkIsSelectAll(resources: Item[]): void;
    createGridView(table: HTMLTableElement): Promise<GridView<Resource>>;
    save(): Promise<unknown>;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
export {};

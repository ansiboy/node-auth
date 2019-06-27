import React = require("react");
import { ListPageProps } from "../../data-component/index";
import { GridView } from "maishu-wuzhui";
import { MenuItem } from "maishu-services-sdk";
interface State {
    activeIndex: number;
}
export default class ResourceListPage extends React.Component<ListPageProps, State> {
    dataTable: HTMLTableElement;
    gridView: GridView<MenuItem>;
    constructor(props: any);
    componentDidMount(): void;
    showPlatformMenu(): void;
    showDistributorMenu(): void;
    showAllMenu(): void;
    render(): JSX.Element;
}
export {};

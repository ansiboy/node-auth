import React = require("react");
import { ListPageProps } from "../../data-component/index";
import { GridView } from "maishu-wuzhui";
import { MenuItem } from "maishu-services-sdk";
import { PermissionService } from "services/permission-service";
import { Category } from "../../../../out/server/entities";
interface State {
    activeIndex: number;
    categories: Category[];
}
export default class ResourceListPage extends React.Component<ListPageProps, State> {
    dataTable: HTMLTableElement;
    gridView: GridView<MenuItem>;
    permissionService: PermissionService;
    constructor(props: any);
    componentDidMount(): Promise<void>;
    showCategoryMenu(index: number, category: Category): void;
    showAllMenu(): void;
    render(): JSX.Element;
}
export {};

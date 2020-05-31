import { DataListPage } from "../../components/index";
import { DataSource, DataControlField } from "maishu-wuzhui";
import { MenuItem } from "../../services/data-sources";
export default class MenuListPage extends DataListPage<MenuItem> {
    dataSource: DataSource<MenuItem>;
    itemName: string;
    constructor(props: any);
    parentDeep(menuItem: MenuItem): number;
    columns: DataControlField<MenuItem>[];
}

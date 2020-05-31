/// <reference types="react" />
import { DataListPage } from "../../components/index";
import { DataControlField } from "maishu-wuzhui";
import { Role } from "gateway-entities";
export default class RoleListPage extends DataListPage<Role> {
    dataSource: import("maishu-wuzhui-helper").DataSource<Role>;
    itemName: string;
    columns: DataControlField<Role>[];
    renderEditor(): JSX.Element;
}

import { DataListPage } from "components/index";
import { Resource } from "maishu-services-sdk";
import { DataSource, DataControlField } from "maishu-wuzhui";
import { dataSources } from "services/data-sources";
import { boundField } from "maishu-wuzhui-helper";

export default class MenuListPage extends DataListPage<Resource> {
    dataSource: DataSource<Resource> = dataSources.resource
    itemName: "菜单";

    constructor(props) {
        super(props)

        this.pageSize = null;
    }

    columns: DataControlField<Resource>[] = [
        boundField<Resource>({ dataField: "name", headerText: "菜单名称" }),
        boundField<Resource>({ dataField: "path", headerText: "路径" }),
        boundField<Resource>({ dataField: "icon", headerText: "图标" }),
        boundField<Resource>({ dataField: "create_date_time", headerText: "创建时间" })
    ];


}
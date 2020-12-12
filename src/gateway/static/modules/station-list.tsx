import { Station } from "gateway-entities";
import { DataListPage } from "maishu-chitu-admin/static";
import { dataSources } from "../services/data-sources";

export default class extends DataListPage<Station> {
    itemName = "站点";
    dataSource = dataSources.station;
    columns = [
        this.boundField({ dataField: "id", headerText: "编号", readOnly: true, headerStyle: { width: "340px" } }),
        this.boundField({ dataField: "path", headerText: "路径", }),
        this.boundField({ dataField: "ip", headerText: "IP", headerStyle: { width: "240px" } }),
        this.boundField({ dataField: "port", headerText: "端口", headerStyle: { width: "240px" } }),
    ];
    deleteConfirmText = (item: Station) => {
        return `确定删除站点 '${item.path}' 吗？`;
    }


}
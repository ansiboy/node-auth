import { DataListPage } from "maishu-chitu-admin/static";
import { Station, dataSources } from "../services/data-sources";

export default class extends DataListPage<Station> {
    dataSource = dataSources.station;
    columns = [
        this.boundField({ dataField: "path", headerText: "路径" })
    ];
    showCommandColumn = false;
}
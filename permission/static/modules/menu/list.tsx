import { DataListPage } from "maishu-chitu-admin/static";
import { DataControlField, CustomBoundField } from "maishu-wuzhui";
import { dataSources, MenuItem } from "services/data-sources";
import { boundField } from "maishu-wuzhui-helper";

let sortFieldWidth = 80;
let nameFieldWidth = 180;
let iconFieldWidth = 120;
let roleFieldWidth = 180;

export default class MenuListPage extends DataListPage<MenuItem> {
    dataSource = dataSources.resource;
    itemName = "菜单";
    showCommandField = false;
    
    constructor(props) {
        super(props)

        this.pageSize = null;
        this.headerFixed = true;
    }

    parentDeep(menuItem: MenuItem) {
        let deep = 0;
        let parent = menuItem.parent;
        while (parent) {
            deep = deep + 1;
            parent = parent.parent;
        }

        return deep;
    }

    columns: DataControlField<MenuItem>[] = [
        boundField<MenuItem>({
            dataField: 'sort_number', itemStyle: { width: `${sortFieldWidth}px` }, headerText: "序号", readOnly: true,

        }),
        new CustomBoundField<MenuItem>({
            dataField: "name",
            headerText: "菜单名称",
            itemStyle: { width: `${nameFieldWidth}px` },
            cellRender: (dataItem, element) => {
                element.style.paddingLeft = `${this.parentDeep(dataItem) * 20 + 10}px`
                element.innerHTML = dataItem.name;
            }
        }),
        boundField<MenuItem>({ dataField: "path", headerText: "路径" }),
        boundField<MenuItem>({ dataField: "icon", headerText: "图标", itemStyle: { width: `${iconFieldWidth}px` } }),
        boundField<MenuItem>({ dataField: "roleNames", headerText: "角色", itemStyle: { width: `${roleFieldWidth}px` } }),
    ];
}


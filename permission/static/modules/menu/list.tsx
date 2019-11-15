import { DataListPage } from "components/index";
import { Resource } from "entities";
import { DataSource, DataControlField, CustomBoundField } from "maishu-wuzhui";
import { dataSources } from "services/data-sources";
import { boundField, dateTimeField } from "maishu-wuzhui-helper";

let sortFieldWidth = 80
let nameFieldWidth = 180

export default class MenuListPage extends DataListPage<Resource> {
    dataSource: DataSource<Resource> = dataSources.resource
    itemName = "菜单";

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

    columns: DataControlField<Resource>[] = [
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
        boundField<Resource>({ dataField: "page_path", headerText: "路径" }),
        boundField<Resource>({ dataField: "icon", headerText: "图标" }),
        dateTimeField<Resource>({ dataField: "create_date_time", headerText: "创建时间" })
    ];

    translate = (items) => {
        items = items.filter(o => o.type == "menu" || o.type == "control");
        items.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
        items = translateToMenuItems(items)
        return items;
    }

}

interface MenuItem extends Resource {
    children: MenuItem[];
    parent: MenuItem,
}

export function translateToMenuItems(resources: Resource[]): MenuItem[] {
    let arr = new Array<MenuItem>();
    let stack: MenuItem[] = [...resources.filter(o => o.parent_id == null).reverse() as MenuItem[]];
    while (stack.length > 0) {
        let item = stack.pop();
        item.children = resources.filter(o => o.parent_id == item.id) as MenuItem[];
        if (item.parent_id) {
            item.parent = resources.filter(o => o.id == item.parent_id)[0] as MenuItem;
        }

        stack.push(...item.children.reverse());

        arr.push(item);
    }

    let ids = arr.map(o => o.id);
    for (let i = 0; i < ids.length; i++) {
        let item = arr.filter(o => o.id == ids[i])[0];
        console.assert(item != null);

        if (item.children.length > 1) {
            item.children.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
        }
    }

    return arr;
}

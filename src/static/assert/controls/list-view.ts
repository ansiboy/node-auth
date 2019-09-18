import { DataSource, DataControlField } from "maishu-wuzhui";
import { MenuItem } from "assert/masters/main-master-page";
import { createGridView } from "maishu-wuzhui-helper";
import { GridView } from "maishu-wuzhui"
import { PageView, PageViewArguments } from "./page-view";

type ListViewArguments<T> = {
    pageSize?: number,
    transform?: (items: T[]) => T[],
    columns: DataControlField<T>[],
    dataSource: DataSource<T>,
} & Exclude<PageViewArguments, "render">

export class ListView<T> extends PageView {
    private _gridView: GridView<T>;

    constructor(args: ListViewArguments<T>) {
        super(args);
        let resource = args.menuItems.filter(o => o.id == args.resourceId)[0];

        let parentDeep = this.parentDeep(resource);
        if (parentDeep > 1) {
            this.showBackButton();
        }

        this.createGridView(args)
    }

    // protected render(element) {
    //     this.createGridView(element, this.args as ListViewArguments<T>)
    // }

    get gridView() {
        return this._gridView;
    }

    private parentDeep(menuItem: MenuItem) {
        let deep = 0;
        let parent = menuItem.parent;
        while (parent) {
            deep = deep + 1;
            parent = parent.parent;
        }

        return deep;
    }

    private createGridView<T>(args: ListViewArguments<T>): GridView<T> {
        let tableElement = document.createElement("table");

        let tableIsFixed = args.pageSize == null;
        let { dataSource, columns } = args;
        let _gridView = createGridView<T>({
            element: tableElement,
            dataSource: dataSource,
            columns: columns,
            pageSize: args.pageSize,
            pagerSettings: {
                activeButtonClassName: 'active',
                buttonContainerWraper: 'ul',
                buttonWrapper: 'li',
                buttonContainerClassName: 'pagination',
                showTotal: true
            },
            sort: args.transform,
            showHeader: !tableIsFixed,
        })

        if (tableIsFixed) {
            tableElement.style.maxWidth = "unset";
            tableElement.style.width = "calc(100% + 18px)";
            let element = document.createElement("div");
            element.innerHTML = `
            <table class="table table-striped table-bordered table-hover" style=" margin: 0 ">
                <thead>
                    <tr>
     
                    </tr>
                </thead>
            </table>
            <div style="height: calc(100% - 160px); width: calc(100% - 300px); position: absolute; overflow-y: scroll; overflow-x: hidden">
            </div>
            `;

            let div = element.querySelector("div");
            div.appendChild(tableElement);

            let tableHeader = element.querySelector("tr");
            columns.map((col) => {
                let th = document.createElement("th");
                console.assert(col != null, "col is null");

                if (col.itemStyle)
                    th.style.width = col.itemStyle["width"];

                th.innerHTML = col.headerText;
                return th;
            }).forEach(th => {
                tableHeader.appendChild(th);
            })

            args.element.appendChild(element);
        }
        else {
            args.element.appendChild(tableElement);
        }

        return _gridView;
    }

}


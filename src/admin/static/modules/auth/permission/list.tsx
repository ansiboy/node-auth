import { sortNumberField, dateTimeField, PageSpiner, PageSpinerContext, customDataField } from "assert/index";
import { ListPage, } from "assert/index";
import React = require("react");
import { Resource } from "entities";
import { boundField } from "maishu-wuzhui-helper";
import { MenuItem } from "assert/masters/main-master-page";
import ReactDOM = require("react-dom");
import { PermissionService } from "assert/services/index";
import { PageProps } from "maishu-chitu-react";
import { translateToMenuItems, dataSources } from "assert/dataSources";

let nameFieldWidth = 280
let remarkWidth = 240

type LoadDataResult = {
    resourceIds: string[],
}

export interface Props extends PageProps {
    data: {
        dataItemId: string,
        resourceId: string,
    }
}

export default class PermissionPage extends React.Component<Props>{
    private ps: PermissionService;
    private resourceIds: string[];
    private checkboxs: HTMLInputElement[] = [];

    constructor(props) {
        super(props);

        this.ps = this.props.createService(PermissionService);
    }

    save() {
        let checkedResourceIds: string[] = this.checkboxs.filter(o => o.checked).map(o => o.value);
        return this.ps.role.resource.set(this.props.data.dataItemId, checkedResourceIds);
    }

    componentDidMount() {

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

    checkItem(menuItem: MenuItem) {
        let p = menuItem;
        while (p) {
            this.checkboxs.filter(o => o.value == p.id)[0].checked = true;
            p = p.parent;
        }
    }


    async loadData(): Promise<LoadDataResult> {
        this.resourceIds = await this.ps.role.resource.ids(this.props.data.dataItemId);
        return { resourceIds: this.resourceIds };
    }

    render() {
        return <PageSpiner load={() => this.loadData()}>
            <PageSpinerContext.Consumer>
                {args => {
                    return <ListPage<Resource> resourceId={this.props.data.resourceId} context={this} dataSource={dataSources.resource}
                        pageSize={null}
                        transform={(items) => {
                            items = items.filter(o => o.type == "menu" || o.type == "control");
                            items.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
                            items = translateToMenuItems(items)
                            return items;
                        }}
                        columns={[
                            sortNumberField(),
                            customDataField({
                                headerText: '菜单名称', itemStyle: { width: `${nameFieldWidth}px` },
                                render: (item: MenuItem, element) => {
                                    ReactDOM.render(<div style={{ paddingLeft: this.parentDeep(item) * 20 + 10 }}>
                                        <div className="checkbox" style={{ margin: 0 }} >
                                            <label>
                                                <input type="checkbox" value={item.id} ref={e => {
                                                    if (!e) return;
                                                    this.checkboxs.push(e);
                                                    e.checked = this.resourceIds.indexOf(item.id) >= 0;
                                                    e.onchange = () => {
                                                        e.checked ? this.checkItem(item) : null;
                                                    }
                                                }} />
                                                <span>{item.name}</span>
                                            </label>
                                        </div>

                                    </div>, element)
                                }
                            }),
                            boundField<MenuItem>({ dataField: "page_path", headerText: "路径" }),
                            boundField<MenuItem>({ dataField: "remark", headerText: "备注", itemStyle: { width: `${remarkWidth}px` } }),
                            dateTimeField<MenuItem>({ dataField: 'create_date_time', headerText: '创建时间', }),
                        ]}>
                    </ListPage>
                }}
            </PageSpinerContext.Consumer>

        </PageSpiner>
    }

}

// import React = require("react");
// import { createGridView, boundField, customField } from "maishu-wuzhui-helper";
// import { DataSource, GridViewDataCell, GridView } from "maishu-wuzhui";
// import ReactDOM = require("react-dom");
// import * as ui from 'maishu-ui-toolkit'
// import { PermissionService } from "assert/services/index";
// import { ItemPageProps, customDataField } from "assert/index";
// import { AppService } from "assert/service";
// import { Resource } from "entities";

// type Item = Resource & { children?: Item[], selected?: boolean }
// interface State {
//     // resources: Item[],
//     title: string,
//     // selectedResourceIds: string[]
//     platformSelectAll: boolean,
//     distributorSelectAll: boolean
// }
// export default class PermissionPage extends React.Component<ItemPageProps<Item>, State>{
//     resourceTable: HTMLTableElement;
//     gridView: GridView<Resource>;
//     resources: Item[];
//     dataSource: DataSource<Resource>;

//     constructor(props) {
//         super(props)

//         this.state = { title: '', platformSelectAll: false, distributorSelectAll: false }

//         let ps = this.props.createService(PermissionService)
//         let roleId = this.props.data.id
//         ps.role.item(roleId).then(async role => {
//             this.setState({ title: `${role.name}权限` })
//         })
//     }
//     selectAll(category: any, checked: boolean) {
//         let resources = this.resources;//.filter(o => o.category == category)
//         for (let i = 0; i < resources.length; i++) {
//             resources[i].selected = true
//             for (let j = 0; j < resources[i].children.length; j++) {
//                 let dataItem = (resources[i].children[j] as Item)
//                 dataItem.selected = checked
//             }
//             this.dataSource.updated.fire(this.dataSource, resources[i])
//         }
//     }
//     createDataSource(resources: Resource[]) {
//         // let roleId = this.props.data.id
//         // if (roleId == PLATFORM_ADMIN_ROLE_ID)
//         //     resources = resources.filter(o => o.category == 'platform')
//         // else
//         //     resources = resources.filter(o => o.category == 'distributor')

//         let ds = new DataSource<Resource>({
//             async select(args) {
//                 if (args.sortExpression) {
//                     let arr = args.sortExpression.split(/\s+/)
//                     let field = arr[0]
//                     let orderType = arr[1] || 'asc'
//                     if (orderType == 'asc') {
//                         resources.sort((c1, c2) => c1[field] <= c2[field] ? 1 : -1)
//                     }
//                     else {
//                         resources.sort((c1, c2) => c1[field] > c2[field] ? 1 : -1)
//                     }
//                 }

//                 let dataItems = resources.slice(args.startRowIndex, args.startRowIndex + args.maximumRows)
//                 let result = { dataItems, totalRowCount: resources.length }
//                 return result
//             }
//         })

//         ds.updated.add(() => {
//             this.checkIsSelectAll(resources)
//         })

//         this.checkIsSelectAll(resources)

//         return ds
//     }
//     checkIsSelectAll(resources: Item[]) {
//         // let platformCommands: Item[] = []
//         // resources.filter(o => o.category == 'platform')
//         //     .forEach((o: Item) => platformCommands.push(...o.children))

//         // let platformSelectAll = platformCommands.filter(o => o.selected).length == platformCommands.length

//         // let distributorCommands: Item[] = []
//         // resources.filter(o => o.category == 'distributor')
//         //     .forEach((o: Item) => distributorCommands.push(...o.children))

//         // let distributorSelectAll = distributorCommands.filter(o => o.selected).length == distributorCommands.length

//         // this.setState({ platformSelectAll, distributorSelectAll })
//     }

//     async createGridView(table: HTMLTableElement) {
//         let ps = this.props.createService(PermissionService);
//         let appService = ps.createService(AppService);
//         let menuItems = await appService.menuList();
//         // menuItems.reverse();

//         let resources: Item[] = [];
//         while (menuItems.length > 0) {
//             let menuItem = menuItems.shift();
//             resources.push(menuItem);
//             menuItem.children.filter(o => o.type == "menu").forEach(c => resources.push(c));
//         }

//         resources.forEach(c => {
//             c.children = c.children.filter(o => o.type == "control");
//         })

//         // resources.reverse();

//         let ds = this.dataSource = this.createDataSource(resources)
//         // let items: { [value: string]: string } = {};
//         // for (let i = 0; i < categroyNames.length; i++) {
//         //     items[categroyNames[i].name] = categroyNames[i].value
//         // }
//         let gridView = createGridView({
//             dataSource: ds,
//             element: table,
//             columns: [
//                 boundField({ dataField: 'name', headerText: '名称', sortExpression: 'name' }),
//                 // valueTextField({
//                 //     dataField: 'category', headerText: '类型', sortExpression: 'category',
//                 //     items
//                 // }),
//                 // customDataField({
//                 //     headerText: '类型',
//                 //     render: (dataItem: Resource, element: HTMLElement) => {
//                 //         let item = categroyNames.filter(o => o.value == dataItem.category)[0]
//                 //         if (item)
//                 //             return item.name

//                 //         return dataItem.category
//                 //     }
//                 // }),
//                 customField({
//                     headerText: '权限',
//                     createItemCell(dataItem: Item) {
//                         let cell = new GridViewDataCell({
//                             render(dataItem: Item, element: HTMLElement) {
//                                 let children = dataItem.children || []
//                                 ReactDOM.render(<>
//                                     <span className="checkbox" key={dataItem.id} style={{ marginRight: 20 }}>
//                                         <input type="checkbox" checked={dataItem.selected == true}
//                                             onChange={e => {
//                                                 dataItem.selected = e.target.checked
//                                                 ds.updated.fire(ds, dataItem)
//                                             }} />
//                                         浏览
//                                     </span>
//                                     {children.map(c =>
//                                         <span className="checkbox" key={c.id} style={{ marginRight: 20 }}>
//                                             <input type="checkbox" checked={c.selected == true}
//                                                 onChange={e => {
//                                                     c.selected = e.target.checked
//                                                     ds.updated.fire(ds, dataItem)
//                                                 }} />
//                                             {c.name}
//                                         </span>
//                                     )}
//                                 </>, element)
//                             }
//                         })

//                         return cell;
//                     }
//                 }),
//                 customField({
//                     headerText: '操作',
//                     itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
//                     createItemCell() {
//                         let cell = new GridViewDataCell({
//                             render(dataItem: Item, element: HTMLElement) {
//                                 let children = dataItem.children || []
//                                 // if (children.length == 0) {
//                                 //     return
//                                 // }
//                                 ReactDOM.render(<span className="checkbox">
//                                     <input type="checkbox"
//                                         checked={children.length == children.filter(o => o.selected).length && dataItem.selected == true}
//                                         onChange={e => {
//                                             dataItem.selected = e.target.checked
//                                             children.forEach(o => o.selected = e.target.checked)
//                                             ds.updated.fire(ds, dataItem)
//                                         }} />
//                                     全选
//                             </span>, cell.element)
//                             }
//                         })
//                         return cell
//                     }
//                 })
//             ],
//             pageSize: null
//         })

//         let roleId = this.props.data.id
//         ps.role.resource.ids(roleId).then(ids => {
//             for (let i = 0; i < resources.length; i++) {
//                 resources[i].selected = ids.indexOf(resources[i].id) >= 0
//                 for (let j = 0; j < resources[i].children.length; j++) {
//                     let child = (resources[i].children[j] as Item)
//                     child.selected = ids.indexOf(child.id) >= 0
//                 }
//                 ds.updated.fire(ds, resources[i])
//             }
//         })

//         return gridView
//     }
//     save() {
//         let roleId = this.props.data.id
//         let ps = this.props.createService(PermissionService)
//         let selectedResourceIds: string[] = []
//         this.resources.forEach(r => {
//             let selectedChildIds = r.children.filter(o => (o as Item).selected).map(o => o.id);
//             if (selectedChildIds.length > 0) {
//                 selectedResourceIds.push(...selectedChildIds)
//                 // selectedResourceIds.push(r.id)
//             }
//             if (r.selected) {
//                 selectedResourceIds.push(r.id)
//             }
//         })
//         let result = ps.role.resource.set(roleId, selectedResourceIds)
//         return result
//     }
//     async componentDidMount() {
//         this.gridView = await this.createGridView(this.resourceTable)
//     }
//     render() {
//         let roleId = this.props.data.id
//         let { title, platformSelectAll, distributorSelectAll } = this.state
//         return <div className="role-permission">
//             <div className="tabbable">
//                 <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
//                     <li className="pull-left">
//                         <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
//                     </li>
//                     <li className="pull-right">
//                         <button className="btn btn-primary"
//                             ref={e => {
//                                 if (!e) return
//                                 ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' })
//                             }}>
//                             <i className="icon-save" />
//                             <span>保存</span>
//                         </button>
//                         <button className="btn btn-primary" onClick={() => this.props.app.back()}>
//                             <i className="icon-reply" ></i>
//                             <span>返回</span>
//                         </button>
//                     </li>
//                 </ul>
//             </div>
//             <div style={{ overflowY: 'auto' }}
//                 ref={e => {
//                     if (!e) return
//                     const SIZE = 180
//                     if (window.innerHeight > SIZE)
//                         e.style.height = `${window.innerHeight - SIZE}px`

//                     window.addEventListener('resize', () => {
//                         if (window.innerHeight > SIZE)
//                             e.style.height = `${window.innerHeight - SIZE}px`
//                     })
//                 }}>
//                 <table ref={e => this.resourceTable = e || this.resourceTable}>

//                 </table>
//             </div>
//             {/* <div style={{ paddingTop: 10 }}>
//                 {roleId == PLATFORM_ADMIN_ROLE_ID ?
//                     <span className="checkbox" style={{ marginRight: 20, display: 'none' }} >
//                         <input type="checkbox" checked={platformSelectAll}
//                             onChange={e => this.selectAll('platform', e.target.checked)} />
//                         全选
//                     </span> :
//                     <span className="checkbox" style={{ display: 'none' }}>
//                         <input type="checkbox" checked={distributorSelectAll}
//                             onChange={e => this.selectAll('distributor', e.target.checked)} />
//                         全选
//                     </span>
//                 }
//             </div> */}

//         </div>
//     }
// }
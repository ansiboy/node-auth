import React = require("react");
import { PermissionService } from "services/permission-service";
import { createGridView, boundField, customField } from "maishu-wuzhui-helper";
import { categroyNames } from "../../common";
import { DataSource, GridViewDataCell, GridView } from "maishu-wuzhui";
import ReactDOM = require("react-dom");
import * as ui from 'maishu-ui-toolkit'
// import { PLATFORM_ADMIN_ROLE_ID } from "settings";
import { Resource } from "maishu-services-sdk";
import { ItemPageProps, customDataField } from "../../data-component/index";

type Item = Resource & { children?: Item[], selected?: boolean }
interface State {
    // resources: Item[],
    title: string,
    // selectedResourceIds: string[]
    platformSelectAll: boolean,
    distributorSelectAll: boolean
}
export default class PermissionPage extends React.Component<ItemPageProps<Item>, State>{
    resourceTable: HTMLTableElement;
    gridView: GridView<Resource>;
    resources: Item[];
    dataSource: DataSource<Resource>;
    ps: PermissionService;

    constructor(props) {
        super(props)

        this.state = { title: '', platformSelectAll: false, distributorSelectAll: false }

        this.ps = this.props.createService(PermissionService)
        let roleId = this.props.data.id
        this.ps.getRole(roleId).then(async role => {
            this.setState({ title: `${role.name}权限` })
        })
    }
    selectAll(category: Resource['category'], checked: boolean) {
        let resources = this.resources.filter(o => o.category == category)
        for (let i = 0; i < resources.length; i++) {
            resources[i].selected = true
            for (let j = 0; j < resources[i].children.length; j++) {
                let dataItem = (resources[i].children[j] as Item)
                dataItem.selected = checked
            }
            this.dataSource.updated.fire(this.dataSource, resources[i])
        }
    }
    async createDataSource(resources: Resource[]): Promise<DataSource<Resource>> {
        let roleId = this.props.data.id
        // if (roleId == PLATFORM_ADMIN_ROLE_ID)
        //     resources = resources.filter(o => o.category == 'platform')
        // else
        //     resources = resources.filter(o => o.category == 'distributor')
        // let roles = await this.ps.myRoles();
        let role = await this.ps.getRole(roleId);
        resources = resources.filter(o => o.category == role.category);

        let ds = new DataSource<Resource>({
            async select(args) {
                if (args.sortExpression) {
                    let arr = args.sortExpression.split(/\s+/)
                    let field = arr[0]
                    let orderType = arr[1] || 'asc'
                    if (orderType == 'asc') {
                        resources.sort((c1, c2) => c1[field] <= c2[field] ? 1 : -1)
                    }
                    else {
                        resources.sort((c1, c2) => c1[field] > c2[field] ? 1 : -1)
                    }
                }

                let dataItems = resources.slice(args.startRowIndex, args.startRowIndex + args.maximumRows)
                let result = { dataItems, totalRowCount: resources.length }
                return result
            }
        })

        ds.updated.add(() => {
            this.checkIsSelectAll(resources)
        })

        this.checkIsSelectAll(resources)

        return ds
    }
    checkIsSelectAll(resources: Item[]) {
        let platformCommands: Item[] = []
        resources.filter(o => o.category == 'platform')
            .forEach((o: Item) => platformCommands.push(...o.children))

        let platformSelectAll = platformCommands.filter(o => o.selected).length == platformCommands.length

        let distributorCommands: Item[] = []
        resources.filter(o => o.category == 'distributor')
            .forEach((o: Item) => distributorCommands.push(...o.children))

        let distributorSelectAll = distributorCommands.filter(o => o.selected).length == distributorCommands.length

        this.setState({ platformSelectAll, distributorSelectAll })
    }

    async createGridView(table: HTMLTableElement) {
        let ps = this.props.createService(PermissionService)
        let resources = this.resources = await ps.getResources()
        let ds = this.dataSource = await this.createDataSource(resources)
        let items: { [value: string]: string } = {};
        for (let i = 0; i < categroyNames.length; i++) {
            items[categroyNames[i].name] = categroyNames[i].value
        }
        let gridView = createGridView({
            dataSource: ds,
            element: table,
            columns: [
                boundField({ dataField: 'name', headerText: '名称', sortExpression: 'name' }),
                // valueTextField({
                //     dataField: 'category', headerText: '类型', sortExpression: 'category',
                //     items
                // }),
                customDataField({
                    headerText: '类型',
                    render: (dataItem: Resource, element: HTMLElement) => {
                        let item = categroyNames.filter(o => o.value == dataItem.category)[0]
                        if (item)
                            return item.name

                        return dataItem.category
                    }
                }),
                customField({
                    headerText: '权限',
                    createItemCell(dataItem: Item) {
                        let cell = new GridViewDataCell({
                            render(dataItem: Item, element: HTMLElement) {
                                let children = dataItem.children || []
                                ReactDOM.render(<>
                                    <span className="checkbox" key={dataItem.id} style={{ marginRight: 20 }}>
                                        <input type="checkbox" checked={dataItem.selected == true}
                                            onChange={e => {
                                                dataItem.selected = e.target.checked
                                                ds.updated.fire(ds, dataItem)
                                            }} />
                                        浏览
                                    </span>
                                    {children.map(c =>
                                        <span className="checkbox" key={c.id} style={{ marginRight: 20 }}>
                                            <input type="checkbox" checked={c.selected == true}
                                                onChange={e => {
                                                    c.selected = e.target.checked
                                                    ds.updated.fire(ds, dataItem)
                                                }} />
                                            {c.name}
                                        </span>
                                    )}
                                </>, element)
                            }
                        })

                        return cell;
                    }
                }),
                customField({
                    headerText: '操作',
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                    createItemCell() {
                        let cell = new GridViewDataCell({
                            render(dataItem: Item, element: HTMLElement) {
                                let children = dataItem.children || []
                                // if (children.length == 0) {
                                //     return
                                // }
                                ReactDOM.render(<span className="checkbox">
                                    <input type="checkbox"
                                        checked={children.length == children.filter(o => o.selected).length && dataItem.selected == true}
                                        onChange={e => {
                                            dataItem.selected = e.target.checked
                                            children.forEach(o => o.selected = e.target.checked)
                                            ds.updated.fire(ds, dataItem)
                                        }} />
                                    全选
                            </span>, cell.element)
                            }
                        })
                        return cell
                    }
                })
            ],
            pageSize: null
        })

        let roleId = this.props.data.id
        ps.getRoleResourceIds(roleId).then(ids => {
            for (let i = 0; i < resources.length; i++) {
                resources[i].selected = ids.indexOf(resources[i].id) >= 0
                for (let j = 0; j < resources[i].children.length; j++) {
                    let child = (resources[i].children[j] as Item)
                    child.selected = ids.indexOf(child.id) >= 0
                }
                ds.updated.fire(ds, resources[i])
            }
        })

        return gridView
    }
    save() {
        let roleId = this.props.data.id
        let ps = this.props.createService(PermissionService)
        let selectedResourceIds: string[] = []
        this.resources.forEach(r => {
            let selectedChildIds = r.children.filter(o => (o as Item).selected).map(o => o.id);
            if (selectedChildIds.length > 0) {
                selectedResourceIds.push(...selectedChildIds)
                // selectedResourceIds.push(r.id)
            }
            if (r.selected) {
                selectedResourceIds.push(r.id)
            }
        })
        let result = ps.setRoleResource(roleId, selectedResourceIds)
        return result
    }
    async componentDidMount() {
        this.gridView = await this.createGridView(this.resourceTable)
    }
    render() {
        let roleId = this.props.data.id
        let { title, platformSelectAll, distributorSelectAll } = this.state
        return <div className="role-permission">
            <div className="tabbable">
                <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
                    <li className="pull-left">
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
                    </li>
                    <li className="pull-right">
                        <button className="btn btn-primary"
                            ref={e => {
                                if (!e) return
                                ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' })
                            }}>
                            <i className="icon-save" />
                            <span>保存</span>
                        </button>
                        <button className="btn btn-primary" onClick={() => this.props.app.back()}>
                            <i className="icon-reply" ></i>
                            <span>返回</span>
                        </button>
                    </li>
                </ul>
            </div>
            <div style={{ overflowY: 'auto' }}
                ref={e => {
                    if (!e) return
                    const SIZE = 180
                    if (window.innerHeight > SIZE)
                        e.style.height = `${window.innerHeight - SIZE}px`

                    window.addEventListener('resize', () => {
                        if (window.innerHeight > SIZE)
                            e.style.height = `${window.innerHeight - SIZE}px`
                    })
                }}>
                <table ref={e => this.resourceTable = e || this.resourceTable}>

                </table>
            </div>
            <div style={{ paddingTop: 10 }}>
                {/* {roleId == PLATFORM_ADMIN_ROLE_ID ?
                    <span className="checkbox" style={{ marginRight: 20, display: 'none' }} >
                        <input type="checkbox" checked={platformSelectAll}
                            onChange={e => this.selectAll('platform', e.target.checked)} />
                        全选
                    </span> :
                    <span className="checkbox" style={{ display: 'none' }}>
                        <input type="checkbox" checked={distributorSelectAll}
                            onChange={e => this.selectAll('distributor', e.target.checked)} />
                        全选
                    </span>
                } */}
            </div>

        </div>
    }
}
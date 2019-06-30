import React = require("react");
import { rules } from "maishu-dilu";
import { dataSources, createMenuDataSource } from "dataSources";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-wuzhui";
import { PermissionService } from "services/permission-service";
import { MenuItem } from "maishu-services-sdk";

import { ItemPage, ItemPageContext, ItemPageProps, InputField, DropdownField, RadioField } from "../../data-component/index";
import { categroyNames, platformCategory } from "../../common";
// export let platformCategory: Category = 'platform'
// export let distributorCategory: Category = 'distributor'
// export let categroyNames = [{ name: "平台", value: platformCategory }, { name: "经销商", value: distributorCategory }]
interface Props extends ItemPageProps<MenuItem> {
    mode: 'new' | 'edit' | 'readonly',
}

interface State {
    checkedChildren: string[]
}

export default class ResourceAdd extends React.Component<Props, State> {
    private operationField: OperationField;
    constructor(props) {
        super(props)
        this.state = { checkedChildren: [] }
    }
    render() {
        return <ItemPage {...this.props}
            beforeSave={async (dataItem: MenuItem) => {
                dataItem.type = 'menu'
            }}>
            <ItemPageContext.Consumer>
                {args => {
                    let dataItem: MenuItem = args.dataItem
                    return <>
                        <div style={{ display: 'table-cell', borderRight: 'solid 1px #cccccc', paddingRight: 40 }}>
                            <InputField label="序号" dataField="sort_number" placeholder="用于对菜单排序，可空" />
                            <DropdownField key={dataItem.category || ''} label="所属菜单" dataField="parent_id"
                                placeholder="请选择所属菜单，可空"
                                items={async () => {
                                    let args: DataSourceSelectArguments = {}
                                    if (dataItem.category) {
                                        args.filter = `category = '${dataItem.category}'`;
                                    }

                                    let menuDataSource = dataSources.menu;
                                    let result = await menuDataSource.executeSelect(args);
                                    let r = (result as DataSourceSelectResult<MenuItem>).dataItems.map(o => ({ name: o.name, value: o.id }));
                                    return r;
                                }} />
                            <InputField label="名称" dataField="name" validateRules={[rules.required('请输入菜单名称')]}
                                placeholder="请输入菜单名称" />
                            <InputField label="路径" dataField="path"
                                placeholder="菜单页面的路径，可空" />

                            <ItemPageContext.Consumer>
                                {args => {
                                    let ps = this.props.createService(PermissionService)
                                    return <OperationField ref={e => this.operationField = e || this.operationField}
                                        dataItem={args.dataItem}
                                        updatePageState={args.updatePageState} service={ps} />
                                }}
                            </ItemPageContext.Consumer>
                            <RadioField dataType='number' label="类型" dataField="category" items={categroyNames}
                                defaultValue={platformCategory} />
                        </div>
                        <div style={{ display: 'table-cell', paddingLeft: 30 }}>
                            <ItemPageContext.Consumer>
                                {args => {
                                    let dataItem: MenuItem = args.dataItem
                                    return <div style={{ width: 400 }}>
                                        <div className="item">
                                            <label>操作项</label>
                                        </div>
                                        <div className="item">
                                            <OperationTable dataItem={dataItem} />
                                        </div>
                                    </div>
                                }}
                            </ItemPageContext.Consumer>
                        </div>
                    </>
                }}
            </ItemPageContext.Consumer>
        </ItemPage >
    }
}

class OperationTable extends React.Component<{ dataItem: MenuItem }, { dataItem: MenuItem }>{
    constructor(props: OperationTable['props']) {
        super(props)
        this.state = { dataItem: props.dataItem }
    }
    componentWillReceiveProps(props: OperationTable['props']) {
        this.setState({ dataItem: props.dataItem })
    }
    render() {
        let { dataItem } = this.state
        return <table className="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th style={{ width: 60 }}>序号</th>
                    <th>名称</th>
                    <th>路径</th>
                    <th style={{ width: 80 }}>操作</th>
                </tr>
            </thead>
            <tbody>
                {dataItem.children.map((r, i) => <tr key={r.id || i}>
                    <td>{r.sort_number}</td>
                    <td>{r.name}</td>
                    <td>{r.path}</td>
                    <td className="text-center">
                        <button className="btn btn-minier btn-info" title="点击编辑">
                            <i className="icon-pencil"> </i>
                        </button>
                        <button className="btn btn-minier btn-danger" title="点击删除">
                            <i className="icon-trash"></i>
                        </button>
                    </td>
                </tr>)}
                {dataItem.children.length == 0 ?
                    <tr>
                        <td className="empty text-center" colSpan={4} style={{ height: 140, paddingTop: 60 }}>
                            暂无操作项
                        </td>
                    </tr> : null}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <button className="btn btn-primary btn-block">添加新的操作项</button>
                    </td>
                </tr>
            </tfoot>
        </table>
    }
}

interface OperationFieldProps {
    dataItem: MenuItem, updatePageState: (dataItem) => null,
    service: PermissionService
}

class OperationField extends React.Component<OperationFieldProps, { dataItem: MenuItem }> {
    constructor(props: OperationField['props']) {
        super(props)

        let dataItem = props.dataItem
        dataItem.originalChildren = dataItem.originalChildren || []
        dataItem.children = dataItem.children || []

        this.state = { dataItem: props.dataItem }
        // this.props.service.getResourceChildCommands(dataItem.id).then(commands => {

        // })
    }
    checkItem(checked: boolean, name: string, path: string) {
        let { dataItem } = this.state
        if (checked) {
            let child = dataItem.originalChildren.filter(o => o.name == name)[0]
            if (child == null) {
                child = {
                    name: name, parent_id: dataItem.id,
                    type: 'button', data: {},
                    category: dataItem.category, path
                } as MenuItem;
            }
            dataItem.children.push(child)
        }
        else {
            dataItem.children = dataItem.children.filter(o => o.name != name)
        }

        this.props.updatePageState(dataItem)
        this.setState({ dataItem })
    }
    componentWillReceiveProps(props: OperationField['props']) {

        let dataItem = props.dataItem
        dataItem.originalChildren = dataItem.originalChildren || []
        dataItem.children = dataItem.children || []

        this.setState({ dataItem: props.dataItem })
    }
    render() {
        let selectedNames = []
        let dataItem = this.state.dataItem
        console.assert(dataItem != null)
        selectedNames = dataItem.children.map(o => o.name)
        return <>
            <div className="item">
                <label>操作项</label>
                <span>
                    <label>
                        <input type="checkbox" checked={selectedNames.indexOf('添加') >= 0}
                            onChange={e => this.checkItem(e.target.checked, '添加', 'javascript:add')} /> 添加
                    </label>
                    <label>
                        <input type="checkbox" checked={selectedNames.indexOf('修改') >= 0}
                            onChange={e => this.checkItem(e.target.checked, '修改', 'javascript:modify')} /> 修改
                    </label>
                    <label>
                        <input type="checkbox" checked={selectedNames.indexOf('删除') >= 0}
                            onChange={e => this.checkItem(e.target.checked, '删除', 'javascript:delete')} /> 删除
                    </label>
                    <label>
                        <input type="checkbox" checked={selectedNames.indexOf('查看') >= 0}
                            onChange={e => this.checkItem(e.target.checked, '查看', 'javascript:view')} /> 查看
                    </label>
                </span>
            </div>
        </>
    }
}


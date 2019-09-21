import React = require("react");
import { boundField, customField } from 'maishu-wuzhui-helper'
import { operationField, dateTimeField, customDataField } from "assert/index";
import { GridViewDataCell, GridView } from "maishu-wuzhui";
import { PermissionService } from "assert/services/index";
import { dataSources, translateToMenuItems } from "assert/dataSources";
import { Resource } from "entities";
import { MenuItem } from "assert/masters/main-master-page";
import { PageProps, ListPage } from "assert/index";
import ReactDOM = require("react-dom");

interface State {
}

let sortFieldWidth = 80
let nameFieldWidth = 180
let operationFieldWidth = 140
let typeFieldWidth = 100
let remarkWidth = 240

export default class ResourceListPage extends React.Component<PageProps, State> {
    dataTable: HTMLTableElement;
    gridView: GridView<Resource>;
    permissionService: PermissionService;

    constructor(props) {
        super(props)
        this.state = { resources: [] };
        this.permissionService = this.props.createService(PermissionService);
    }
    async componentDidMount() {


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

    render() {
        return <ListPage<Resource> {...{ resourceId: this.props.data.resourceId }} context={this} dataSource={dataSources.resource}
            pageSize={null}
            transform={(items) => {
                items = items.filter(o => o.type == "menu" || o.type == "control");
                items.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
                items = translateToMenuItems(items)
                return items;
            }}
            columns={[
                boundField<MenuItem>({ dataField: 'sort_number', itemStyle: { width: `${sortFieldWidth}px` }, headerText: "序号" }),
                customField<MenuItem>({
                    headerText: '菜单名称',
                    itemStyle: { width: `${nameFieldWidth}px` },
                    createItemCell: () => {
                        let cell = new GridViewDataCell<MenuItem>({
                            render: (item: MenuItem, element) => {
                                element.style.paddingLeft = `${this.parentDeep(item) * 20 + 10}px`
                                element.innerHTML = item.name;
                            }
                        })

                        return cell
                    }
                }),
                boundField<MenuItem>({ dataField: "page_path", headerText: "路径" }),
                customDataField<MenuItem>({
                    headerText: "图标", itemStyle: { width: "180px" },
                    render: (dataItem, element) => {
                        ReactDOM.render(<>
                            {dataItem.icon ? <i className={`${dataItem.icon}`} style={{ marginRight: 10 }}></i> : null}
                            <span>{dataItem.icon}</span>
                        </>, element)
                    }
                }),
                boundField<MenuItem>({ dataField: "remark", headerText: "备注", itemStyle: { width: `${remarkWidth}px` } }),
                boundField<MenuItem>({ dataField: "type", headerText: "类型", itemStyle: { width: `${typeFieldWidth}px` } }),
                dateTimeField<MenuItem>({ dataField: 'create_date_time', headerText: '创建时间', }),
                operationField<MenuItem>(this.props.data.resourceId, this.permissionService, this, `${operationFieldWidth}px`)
            ]} />
    }
}

// return <>
//     <div className="tabbable">
//         <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
//             <li className="pull-left">
//                 <div style={{ fontWeight: 'bold', fontSize: 16 }}>菜单管理</div>
//             </li>
//             <li className="pull-right">
//                 <button className="btn btn-primary pull-right"
//                     onClick={() => {
//                         this.props.app.forward('menu/item', this.props.data)
//                     }}>
//                     <i className="icon-plus" />
//                     <span>添加</span>
//                 </button>
//             </li>
//         </ul>
//     </div>
//     <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
//         <thead>
//             <tr>
//                 <th style={{ width: sortFieldWidth }}>序号</th>
//                 <th style={{ width: nameFieldWidth }}>菜单名称</th>
//                 <th style={{}}>路径</th>
//                 <th style={{ width: remarkWidth }}>备注</th>
//                 <th style={{ width: typeFieldWidth }}>类型</th>
//                 <th style={{ width: createDateTimeFieldWidth }}>创建时间</th>
//                 <th style={{ width: operationFieldWidth + 18 }}>操作</th>
//             </tr>
//         </thead>
//     </table>
//     <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll' }}>
//         <table className="table table-striped table-bordered table-hover"
//             ref={e => this.dataTable = e || this.dataTable}>

//         </table>
//     </div>
// </>
{/* <tbody>
                        {resources.map(resource =>
                            <tr key={resource.id}>
                                <td style={{ width: sortFieldWidth }}>{resource.sort_number}</td>
                                <td style={{ width: nameFieldWidth, paddingLeft: `${this.parentDeep(resource) * 20 + 10}px` }}>{resource.name}</td>
                                <td >{resource.page_path}</td>
                                <td style={{ width: remarkWidth }} >{resource.remark}</td>
                                <td style={{ width: typeFieldWidth, textAlign: "center" }}>{resource.type == 'menu' ? '菜单' : resource.type == 'button' ? '按钮' : ''}</td>
                                <td style={{ width: createDateTimeFieldWidth }}>{toDateTimeString(resource.create_date_time)}</td>
                                <td style={{ width: operationFieldWidth, textAlign: "center" }}
                                    ref={e => {
                                        if (!e) return;

                                        renderOperationButtons(this.props.data.resourceId, currentResource.children, e, currentResource, this.props.app);

                                    }}>
                                </td>
                            </tr>
                        )}
                    </tbody> */}
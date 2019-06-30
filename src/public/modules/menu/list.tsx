import React = require("react");
import { boundField, customField, createGridView } from 'maishu-wuzhui-helper'
import { operationField, valueTextField, dateTimeField, ListPageProps } from "../../data-component/index";
import { GridViewDataCell, DataSource, GridView } from "maishu-wuzhui";
import ReactDOM = require("react-dom");
import { CategoryCode, MenuItem, Resource } from "maishu-services-sdk";
import { dataSources } from "dataSources";
import { PermissionService } from "services/permission-service";
import { Category } from "../../../../out/server/entities";

interface State {
    activeIndex: number,
    categories: Category[],
}

let sortFieldWidth = 80
let nameFieldWidth = 280
let operationFieldWidth = 200
let createDateTimeFieldWidth = 160
let hideFieldWidth = 90
let typeFieldWidth = 140

export default class ResourceListPage extends React.Component<ListPageProps, State> {
    dataTable: HTMLTableElement;
    gridView: GridView<MenuItem>;
    permissionService: PermissionService;

    constructor(props) {
        super(props)
        this.state = { activeIndex: 0, categories: [] };
        this.permissionService = this.props.createService(PermissionService);
    }
    async componentDidMount() {

        let categories = await this.permissionService.category.list();
        this.setState({ categories });
        let categroyNames = {}
        for (let i = 0; i < categories.length; i++) {
            categroyNames[categories[i].code] = categories[i].name;
        }

        // categroyNames[platformCategory] = '平台'
        // categroyNames[distributorCategory] = '经销商'
        this.gridView = createGridView({
            dataSource: dataSources.menu,
            element: this.dataTable,
            showHeader: false,
            showFooter: false,
            pageSize: null,
            columns: [
                boundField({ dataField: 'sort_number', itemStyle: { width: `${sortFieldWidth}px` } }),
                customField({
                    headerText: '菜单名称',
                    itemStyle: { width: `${nameFieldWidth}px` },
                    createItemCell() {
                        let cell = new GridViewDataCell<any>({
                            render(item, element) {
                                if (item.parent_id) {
                                    element.style.paddingLeft = '40px'
                                }

                                element.innerHTML = item.name;
                            }
                        })

                        return cell
                    }
                }),
                boundField({ dataField: 'path', headerText: '路径' }),
                valueTextField<Resource>({
                    dataField: 'category', headerText: '类型', items: categroyNames,
                    itemStyle: { width: `${typeFieldWidth}px` }
                }),
                // customField({
                //     headerText: '是否隐藏',
                //     itemStyle: { textAlign: 'center', width: `${hideFieldWidth}px` } as CSSStyleDeclaration,
                //     createItemCell() {
                //         let cell = new GridViewDataCell({
                //             render(dataItem: Resource, element) {
                //                 ReactDOM.render(<label className="switch">
                //                     <input type="checkbox" className="ace ace-switch ace-switch-5"
                //                         ref={e => {
                //                             if (!e) return
                //                             e.checked = (dataItem.data || {}).visible == false
                //                             e.onchange = () => {
                //                                 dataItem.data = dataItem.data || {}
                //                                 dataItem.data.visible = !e.checked;
                //                                 let objectType = getObjectType(location);
                //                                 (dataSources[objectType] as DataSource<Resource>).update(dataItem)
                //                             }
                //                         }} />
                //                     <span className="lbl middle"></span>
                //                 </label>, element)
                //             }
                //         })

                //         return cell
                //     }
                // }),
                dateTimeField({ dataField: 'create_date_time', headerText: '创建时间', }),
                operationField(this.props, "menu", `${operationFieldWidth - 18}px`)
            ]
        })
    }

    // showPlatformMenu() {
    //     this.gridView.dataSource.select({
    //         filter: `category = '${platformCategory}'`
    //     })

    //     this.setState({ activeIndex: 1 })
    // }

    // showDistributorMenu() {
    //     this.gridView.dataSource.select({
    //         filter: `category = '${distributorCategory}'`
    //     })

    //     this.setState({ activeIndex: 2 })
    // }

    showCategoryMenu(index: number, category: Category) {
        this.gridView.dataSource.select({
            filter: `category = '${category.code}'`
        })
        this.setState({ activeIndex: index + 1 })
    }

    showAllMenu() {
        this.gridView.dataSource.select({
        })

        this.setState({ activeIndex: 0 })
    }

    render() {
        let { activeIndex, categories } = this.state
        return <>
            <div className="tabbable">
                <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
                    <li className={activeIndex == 0 ? 'pull-left active' : 'pull-left'}>
                        <a href="javascript:" onClick={() => this.showAllMenu()}>全部</a>
                    </li>
                    {categories.map((o, i) =>
                        <li key={i} className={activeIndex == i + 1 ? 'pull-left active' : 'pull-left'}>
                            <a href="javascript:" onClick={() => this.showCategoryMenu(i, o)}>{o.name}</a>
                        </li>
                    )}
                    <li className="pull-right">
                        <button className="btn btn-primary pull-right"
                            onClick={() => {
                                this.props.app.forward('menu/item', this.props.data)
                            }}>
                            <i className="icon-plus" />
                            <span>添加</span>
                        </button>
                    </li>
                </ul>
            </div>
            <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                <thead>
                    <tr>
                        <th style={{ width: sortFieldWidth }}>序号</th>
                        <th style={{ width: nameFieldWidth }}>菜单名称</th>
                        <th style={{}}>路径</th>
                        <th style={{ width: typeFieldWidth }}>类型</th>
                        {/* <th style={{ width: hideFieldWidth }}>是否隐藏</th> */}
                        <th style={{ width: createDateTimeFieldWidth }}>创建时间</th>
                        <th style={{ width: operationFieldWidth }}>操作</th>
                    </tr>
                </thead>
            </table>
            <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll' }}>
                <table className="table table-striped table-bordered table-hover"
                    ref={e => this.dataTable = e || this.dataTable}>
                </table>
            </div>
        </>
    }
}
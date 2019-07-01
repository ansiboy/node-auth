import React = require("react");
import { DataSource, GridView, DataControlField } from "maishu-wuzhui";
import { createGridView } from "maishu-wuzhui-helper";
import { constants, getObjectType } from "./common";
import { PermissionService } from 'maishu-services-sdk'
import { Application, Page } from "maishu-chitu-react";
import { parseUrl } from "maishu-chitu";

interface State {
    addButton?: JSX.Element,
    title?: string,
}

export interface ListPageProps {
    app: Application;
    data: {
        resourceId: string,
        // objectType: string,
    };
    createService: Page["createService"];
    columns: DataControlField<any>[],
    showHeader?: boolean,
    pageSize?: number,
    source: Page,
}

interface Props extends ListPageProps {
    search?: JSX.Element,
    right?: JSX.Element,
    dataSource: DataSource<any>,
}

export let ListPageContext = React.createContext<{ dataSource: DataSource<any> }>(null)

export class ListPage extends React.Component<Props, State> {
    dataSource: DataSource<any>
    gridView: GridView<any>
    table: any;
    constructor(props: ListPage['props']) {
        super(props)

        this.state = {};
        this.dataSource = this.props.dataSource;

        // let url = location.hash.substr(1);
        // let obj = parseUrl(url)
        // let arr = obj.pageName.split('/')

        // if (this.dataSource == null)
        //     throw new Error(`Data source ${this.props.data.objectType} is not exists`)

        if (props.data.resourceId) {
            let ps = this.props.createService<PermissionService>(PermissionService)
            ps.getResourceList({ filter: `id = '${props.data.resourceId}'` })
                .then(r => {
                    if (r.dataItems.length > 0)
                        this.setState({ title: r.dataItems[0].name })
                })
        }
    }


    async loadResourceAddButton() {
        let resource_id = this.props.data.resourceId;
        if (!resource_id) return null

        let ps = this.props.createService<PermissionService>(PermissionService)
        let resources = await ps.getResourceList({})
        let menuItem = resources.dataItems.filter(o => o.id == resource_id)[0]; //await dataSources.menu.getItem(resource_id) //s.menuItem(resource_id)
        console.assert(menuItem != null)
        let menuItemChildren = resources.dataItems.filter(o => o.parent_id == menuItem.id);
        let addItem = (menuItemChildren || []).filter(o => o.name == '添加')[0]
        if (!addItem) return null

        let objectType = getObjectType(this.props.source.url);
        let path = `${objectType}/item?resourceId=${menuItem.id}`
        let addButton = <button className="btn btn-primary pull-right"
            onClick={() => {
                this.props.app.forward(path, this.props.data)
            }}>
            <i className="icon-plus" />
            <span>添加</span>
        </button>

        return addButton
    }

    async componentDidMount() {

        this.gridView = createGridView({
            element: this.table,
            dataSource: this.dataSource,
            columns: this.props.columns,
            pageSize: this.props.pageSize ? this.props.pageSize : constants.pageSize,
            pagerSettings: {
                activeButtonClassName: 'active',
                buttonContainerWraper: 'ul',
                buttonWrapper: 'li',
                buttonContainerClassName: 'pagination',
                showTotal: true
            },
            // showHeader: this.props.showHeader,

        })

        let addButton = await this.loadResourceAddButton()
        this.setState({ addButton })
    }


    render() {
        let { addButton, title } = this.state || {} as State
        let { search, right } = this.props
        if (!right) {
            right = <li className="pull-left">
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
            </li>
        }
        return <ListPageContext.Provider value={{ dataSource: this.dataSource }}>
            <div className="tabbable">
                <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
                    {right}
                    <li className="pull-right" ref={e => { }}>
                        {addButton}
                    </li>
                    {search}
                </ul>
            </div>
            <table ref={e => this.table = e || this.table}>

            </table>
        </ListPageContext.Provider>
    }
}
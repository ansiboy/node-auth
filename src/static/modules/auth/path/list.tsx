import { operationField, customDataField, ListPage } from "assert/index";
import React = require("react");
import { dataSources, MyDataSource, translateToMenuItems, Module } from "assert/dataSources";
import { Path, Resource } from "entities";
import { PermissionService } from "assert/services/index";
import { MenuItem } from "assert/masters/main-master-page";
import { createGridView, customField } from "maishu-wuzhui-helper";
import { GridViewDataCell, GridView } from "maishu-wuzhui";
import ReactDOM = require("react-dom");
import { ValueStore } from "maishu-chitu";
import { PageProps } from "assert/index";

let nameFieldWidth = 280
let operationFieldWidth = 200


interface State {

}


export default class PathListPage extends React.Component<PageProps, State>{
    private ps: PermissionService;
    gridView: GridView<Resource>;
    dataTable: HTMLTableElement;
    allPaths: any;
    private pathsStorage = new ValueStore<Path[]>();

    constructor(props) {
        super(props);
        this.state = {};

        this.ps = this.props.createService(PermissionService);
        this.ps.path.list().then(paths => {
            this.pathsStorage.value = paths;
        })
    }

    async componentDidMount() {

    }

    displayName(menuItem: MenuItem) {
        let names: string[] = [];
        let parent = menuItem;
        while (parent) {
            names.unshift(parent.name);
            parent = parent.parent;
        }

        let name = names.join(" - ");
        return name;
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
        let { } = this.state;
        return <ListPage dataSource={dataSources.module} resourceId={this.props.data.resourceId}
            pageSize={null}
            // transform={(dataItems) => {
            //     dataItems = translateToMenuItems(dataItems);
            //     return dataItems;
            // }}
            columns={[
                customField<MenuItem>({
                    headerText: '功能模块',
                    itemStyle: { width: `${nameFieldWidth}px` },
                    createItemCell: () => {
                        let cell = new GridViewDataCell<MenuItem>({
                            render: (item: MenuItem, element) => {
                                element.style.paddingLeft = `${this.parentDeep(item) * 20 + 20}px`
                                element.innerHTML = item.name;
                            }
                        })

                        return cell
                    }
                }),
                customDataField<Module>({
                    headerText: "路径",
                    render: (dataItem, element) => {
                        // let renderPaths = (paths: Path[]) => {
                        //     paths = paths.filter(o => o.resource_id == dataItem.id);
                        //     (dataItem as MyMenuItem).paths = paths;
                        let paths = dataItem.paths;
                        ReactDOM.render(<table className="table" style={{ marginBottom: 0, backgroundColor: "unset" }}>
                            <tbody>
                                {paths.map(o =>
                                    <tr key={o.id} style={{ paddingBottom: 6 }}>
                                        <td style={{ borderTop: 0 }}>{o.value}</td></tr>
                                )}
                            </tbody>
                        </table>, element)
                        // }

                        // this.pathsStorage.attach((value) => {
                        //     renderPaths(value);
                        // })
                    }
                }),
                operationField<MenuItem>(this.props.data.resourceId, this.ps, this, `${operationFieldWidth - 18}px`)
            ]}>

        </ListPage>

    }
}
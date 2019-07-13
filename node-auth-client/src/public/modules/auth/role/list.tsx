import React = require("react");
import { dateTimeField, operationField } from "assert/index";
import { ListPage, ListPageProps, } from "assert/index";
import { boundField } from "maishu-wuzhui-helper";
import { dataSources, translateToMenuItems } from "assert/dataSources";
import { PermissionService } from "assert/services/index";
import { MenuItem } from "assert/masters/main-master-page";
import { PageProps } from "assert/components/page-props";

interface State {
    currentMenuItem?: MenuItem
}

export default class RoleListPage extends React.Component<PageProps, State> {
    ps: any;

    constructor(props) {
        super(props);
        this.state = {}
        this.ps = this.props.createService(PermissionService);
    }
    async componentDidMount() {
        let [resources] = await Promise.all([this.ps.resource.list()]);
        let menuItems = translateToMenuItems(resources);
        let currentMenuItem = menuItems.filter(o => o.id == this.props.data.resourceId)[0];
        this.setState({ currentMenuItem })
    }
    render() {

        let { currentMenuItem } = this.state;

        if (!currentMenuItem) {
            return <div className="empty">
                数据正在加载中...
            </div>
        }

        return <ListPage resourceId={this.props.data.resourceId} context={this} dataSource={dataSources.role}
            columns={[
                boundField({ dataField: 'id', headerText: '编号', headerStyle: { width: '300px' }, itemStyle: { textAlign: 'center' } }),
                boundField({ dataField: 'name', headerText: '名称' }),
                dateTimeField({ dataField: 'create_date_time', headerText: '创建时间' }),
                operationField(this.props.data.resourceId, this.ps, this, '160px')
            ]}
        >

        </ListPage>
    }
}
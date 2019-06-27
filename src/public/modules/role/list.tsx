import React = require("react");
import { ListPage, ListPageProps, dateTimeField, operationField } from "../../data-component/index";
import { createRoleDataSource } from "client/dataSources";
import { boundField } from "maishu-wuzhui-helper";
import { DataSource } from "maishu-wuzhui";

export default class RoleListPage extends React.Component<ListPageProps> {
    dataSource: DataSource<any>;

    constructor(props) {
        super(props);

        this.dataSource = createRoleDataSource(this.props.app);
    }
    render() {
        return <ListPage {...this.props} dataSource={this.dataSource} columns={[
            boundField({ dataField: 'id', headerText: '编号', headerStyle: { width: '300px' }, itemStyle: { textAlign: 'center' } }),
            boundField({ dataField: 'name', headerText: '用户身份' }),
            dateTimeField({ dataField: 'create_date_time', headerText: '创建时间' }),
            operationField(this.props, this.dataSource, '160px')
        ]}>

        </ListPage>
    }
}
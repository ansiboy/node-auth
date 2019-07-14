import React = require("react");
import { dateTimeField, sortNumberField, customDataField, operationField, TextInput as InputField, RadioListInput as RadioField } from "assert/index";
import { createItemDialog, ListPage } from "assert/index";
import { boundField } from "maishu-wuzhui-helper";
import { DataSourceSelectArguments } from "maishu-wuzhui";
import * as ui from 'maishu-ui-toolkit'
import { dataSources } from "assert/dataSources";
import { User, Role } from "entities";
import { PageProps } from "assert/index";
import { PermissionService } from "assert/services/index";
import { rules } from "maishu-dilu";

interface State {
    person?: any,
    activeIndex: number,
}
export default class UserListPage extends React.Component<PageProps, State> {
    dialogElement: HTMLElement;
    listPage: ListPage<User>;
    searchTextInput: HTMLInputElement;
    ps: PermissionService;

    constructor(props) {
        super(props)
        this.state = { activeIndex: 0 };
        this.ps = this.props.createService(PermissionService);
    }

    async active(activeIndex: number) {
        let args: DataSourceSelectArguments = {}
        this.listPage.dataSource.select(args)
        this.setState({ activeIndex })
    }

    showAuthDialog(): void {
        ui.showDialog(this.dialogElement)
    }

    async search(value: string) {
        value = (value || '').trim()
        let args = this.listPage.gridView.selectArguments
        args.startRowIndex = 0
        args.filter = `mobile like '%${value}%'`
        await this.listPage.dataSource.select(args)
    }
    showItem(dataItem: User) {
        itemDialog.show(dataItem);
    }
    deleteItem(dataItem: User) {
        ui.confirm({
            title: "请确认",
            message: `确定删除手机号为'${dataItem.mobile}'的用户吗`,
            confirm: async () => {
                return dataSources.user.delete(dataItem);
            }
        })
    }
    render() {
        let { person } = this.state
        return <>
            <ListPage<User> resourceId={this.props.data.resourceId} ref={e => this.listPage = e || this.listPage}
                context={{
                    showItem: (dataItem: User) => this.showItem(dataItem),
                    deleteItem: (dataItem: User) => this.deleteItem(dataItem)
                }}
                dataSource={dataSources.user}
                columns={[
                    sortNumberField(),
                    boundField({
                        headerText: '用户手机',
                        dataField: 'mobile',
                        headerStyle: { width: "180px" }
                    }),
                    boundField({
                        headerText: '用户名',
                        dataField: 'user_name'
                    }),
                    boundField({
                        headerText: '邮箱',
                        dataField: 'email'
                    }),
                    customDataField<User>({
                        headerText: "用户身份",
                        render: (o) => o.role ? o.role.name : ""
                    }),
                    dateTimeField({ dataField: 'lastest_login', headerText: '最后登录时间' }),
                    dateTimeField({ dataField: 'create_date_time', headerText: '创建时间', }),
                    operationField(this.props.data.resourceId, this.ps, this, '160px')
                ]} />

        </>
    }
}

const itemDialog = createItemDialog(dataSources.user, "用户", <>
    <div className="form-group clearfix">
        <InputField<User> dataField="mobile" label="手机号码*" placeholder="请输入手机号码"
            validateRules={[
                rules.required("请输入手机号码")
            ]} />
    </div>
    <div className="form-group clearfix">
        <InputField<User> dataField="user_name" label="用户名" placeholder="请输入用户名" />
    </div>
    <div className="form-group clearfix">
        <InputField<User> dataField="email" label="电子邮箱" placeholder="请输入电子邮箱" />
    </div>
    <div className="form-group clearfix">
        <InputField<User> dataField="password" label="密码*" placeholder="请输入登录密码"
            validateRules={[
                rules.required("请输入登录密码")
            ]} />
    </div>
    <div className="form-group clearfix">
        <RadioField<User, Role> dataSource={dataSources.role} nameField="name" valueField="id"
            label="角色" dataField="role_id" dataType="string"
            validateRules={[
                rules.required("请选择用户角色")
            ]}
        />
    </div>
</>)

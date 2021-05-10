import { dataSources, MyUser, MyUser as User } from "../services/data-sources";
import { boundField, dateTimeField, DataControlField, DataSource, customField, customDataField } from "maishu-wuzhui-helper";
import { DataListPage, DataListPageState } from "maishu-data-page";
import { rules } from "maishu-dilu";
import React = require("react");
import * as ui from "maishu-ui-toolkit";
import { GatewayService } from "../services/gateway-service";
import { PageProps } from "maishu-chitu-react";
import { Role } from "gateway-entities";

interface Props extends PageProps {

}

interface State extends DataListPageState {
    roles?: Role[],
    selectedRoleIds?: string[],
}

export default class UserListPage extends DataListPage<User, Props, State> {
    dataSource = dataSources.user;
    itemName: string = "用户";
    columns: DataControlField<User>[] = [
        boundField<User>({
            dataField: "mobile", headerText: "用户手机", headerStyle: { width: "240px" },
            validation: { rules: [rules.required("请输入手机号码")] }, emptyText: "必填，用户手机号码"
        }),
        boundField<User>({
            dataField: "user_name", headerText: "用户名", headerStyle: { width: "240px" }, readOnly: true,
            emptyText: "可选，用户登录用户名"
        }),
        boundField<User>({
            dataField: "password", headerText: "密码", visible: false,
            emptyText: "必填，用户登录密码"

        }),
        boundField<User>({
            dataField: "email", headerText: "邮箱",
            emptyText: "可选，用户邮箱"
        }),
        customDataField<MyUser>({
            headerText: "角色",
            render: (dataItem) => {
                return (dataItem.roles || []).map(o => o.name).join(",")
            }
        }),
        dateTimeField<User>({ dataField: "create_date_time", headerText: "最后登录", readOnly: true }),
    ];
    private dialogElement: HTMLElement;
    private selectedUser: User;

    constructor(props) {
        super(props);
        let gs = this.props.createService(GatewayService);
        gs.roleList().then(r => {
            this.setState({ roles: r.dataItems })
        })
    }

    async showRoleDialogs(user: MyUser) {
        this.selectedUser = user;
        let selectedRoleIds = (user.roles || []).map(o => o.id);
        this.setState({ selectedRoleIds });
        ui.showDialog(this.dialogElement);
    }

    async setRoles(userId: string, roleIds: string[]) {
        let gs = this.props.createService(GatewayService);

        await gs.setUserRoles(userId, roleIds);
        this.selectedUser.roles = (this.state.roles || []).filter(o => roleIds.indexOf(o.id) >= 0);
        dataSources.user.updated.fire({ sender: dataSources.user, dataItem: this.selectedUser });
        ui.hideDialog(this.dialogElement);
    }

    leftCommands(dataItem: User) {
        return [
            <button key="btn-set-roles" className="btn btn-minier btn-info" onClick={() => this.showRoleDialogs(dataItem)}>
                <span>设置角色</span>
            </button>
        ]
    }

    render() {
        let roles = this.state?.roles || [];
        let selectedRoleIds = this.state?.selectedRoleIds || [];
        return <>{super.render()}
            <div className="modal fade in" ref={e => this.dialogElement = this.dialogElement || e}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">设置角色</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            {roles.map(o => <label key={o.id} className="checkbox-inline">
                                <input type="checkbox" checked={selectedRoleIds.indexOf(o.id) >= 0} onChange={e => {
                                    if (e.target.checked) {
                                        selectedRoleIds.push(o.id);
                                    }
                                    else {
                                        selectedRoleIds = selectedRoleIds.filter(a => a != o.id);
                                    }
                                    this.setState({ selectedRoleIds });
                                }} />{o.name}
                            </label>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                <i className="icon-reply" ></i>
                                <span>取消</span>
                            </button>
                            <button type="button" className="btn btn-primary"
                                ref={(o: HTMLButtonElement) => {
                                    if (!o) return;
                                    ui.buttonOnClick(o, () => this.setRoles(this.selectedUser.id, this.state.selectedRoleIds));

                                }}>
                                <i className="icon-ok"></i>
                                <span>确认</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}


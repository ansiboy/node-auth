import { User } from "maishu-services-sdk";
import { dataSources } from "../../services/data-sources";
import { DataSource, DataControlField } from "maishu-wuzhui";
import { boundField } from "maishu-wuzhui-helper";
import React = require("react");
import { TextInput, DataListPage } from "components/index";

export default class UserListPage extends DataListPage<User> {
    dataSource: DataSource<User> = dataSources.user;
    itemName: string;
    columns: DataControlField<User>[] = [
        boundField<User>({ dataField: "mobile", headerText: "用户手机" }),
        boundField<User>({ dataField: "user_name", headerText: "用户名" }),
        boundField<User>({ dataField: "email", headerText: "邮箱" }),
        boundField<User>({ dataField: "role_id", headerText: "用户身份" }),
        boundField<User>({ dataField: "create_date_time", headerText: "最后登录" }),
    ];

    renderEditor() {
        return <>
            <div className="form-group clearfix">
                <label>用户手机</label>
                <span>
                    <TextInput<User> dataField="mobile" dataType="string" />
                </span>
            </div>
            <div className="form-group clearfix">
                <label>用户名</label>
                <span>
                    <TextInput<User> dataField="user_name" dataType="string" />
                </span>
            </div>

        </>
    }

}
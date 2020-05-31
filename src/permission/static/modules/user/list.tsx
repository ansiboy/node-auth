import { User } from "permission-entities";
import { dataSources } from "../../services/data-sources";
import { boundField, dateTimeField, DataControlField, DataSource } from "maishu-wuzhui-helper";
import { DataListPage } from "maishu-chitu-admin/static";
import { rules } from "maishu-dilu";

export default class UserListPage extends DataListPage<User> {
    dataSource: DataSource<User> = dataSources.user;
    itemName: string = "用户";
    columns: DataControlField<User>[] = [
        boundField<User>({ dataField: "mobile", headerText: "用户手机", validateRules: [rules.required("请输入手机号码")] }),
        boundField<User>({ dataField: "user_name", headerText: "用户名", readOnly: true }),
        boundField<User>({ dataField: "email", headerText: "邮箱" }),
        dateTimeField<User>({ dataField: "create_date_time", headerText: "最后登录", readOnly: true }),
    ];
}
import { User } from "entities";
import { dataSources } from "../../services/data-sources";
import { DataSource, DataControlField } from "maishu-wuzhui";
import { boundField, dateTimeField } from "maishu-wuzhui-helper";
import { DataListPage } from "components/index";

export default class UserListPage extends DataListPage<User> {
    dataSource: DataSource<User> = dataSources.user;
    itemName: string = "用户";
    columns: DataControlField<User>[] = [
        boundField<User>({ dataField: "mobile", headerText: "用户手机" }),
        boundField<User>({ dataField: "user_name", headerText: "用户名", readOnly: true }),
        boundField<User>({ dataField: "email", headerText: "邮箱" }),
        boundField<User>({ dataField: "role_id", headerText: "用户身份" }),
        dateTimeField<User>({ dataField: "create_date_time", headerText: "最后登录" }),
    ];
}
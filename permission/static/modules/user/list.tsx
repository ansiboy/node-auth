import { User } from "entities";
import { dataSources, MyUser } from "../../services/data-sources";
import { DataSource, DataControlField } from "maishu-wuzhui";
import { boundField, dateTimeField } from "maishu-wuzhui-helper";
import { DataListPage } from "maishu-chitu-admin/static";

export default class UserListPage extends DataListPage<MyUser> {
    dataSource: DataSource<MyUser> = dataSources.user;
    itemName: string = "用户";
    columns: DataControlField<MyUser>[] = [
        boundField<MyUser>({ dataField: "mobile", headerText: "用户手机" }),
        boundField<MyUser>({ dataField: "user_name", headerText: "用户名", readOnly: true }),
        boundField<MyUser>({ dataField: "email", headerText: "邮箱" }),
        boundField<MyUser>({ dataField: "roleNames", headerText: "用户身份" }),
        dateTimeField<MyUser>({ dataField: "create_date_time", headerText: "最后登录" }),
    ];
}
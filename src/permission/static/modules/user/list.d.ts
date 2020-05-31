import { User } from "permission-entities";
import { DataSource, DataControlField } from "maishu-wuzhui";
import { DataListPage } from "maishu-chitu-admin/static";
export default class UserListPage extends DataListPage<User> {
    dataSource: DataSource<User>;
    itemName: string;
    columns: DataControlField<User>[];
}

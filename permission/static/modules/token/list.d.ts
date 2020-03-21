import { DataListPage } from "../../components/index";
import { TokenData } from "gateway-entities";
import { DataSource } from "maishu-wuzhui";
export default class TokenListPage extends DataListPage<TokenData> {
    dataSource: DataSource<TokenData>;
    itemName: string;
    columns: (import("maishu-wuzhui").BoundField<TokenData> & import("maishu-wuzhui-helper").FieldValidate)[];
}

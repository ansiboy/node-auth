import { DataListPage } from "components/index";
import { Token } from "entities";
import { DataSource } from "maishu-wuzhui";
import { dataSources } from "services/data-sources";
import { boundField, dateTimeField } from "maishu-wuzhui-helper";

export default class TokenListPage extends DataListPage<Token>{
    dataSource: DataSource<Token> = dataSources.token;
    itemName: string = "令牌";
    columns = [
        boundField<Token>({ dataField: "id", headerText: "编号", itemStyle: { width: "300px" } }),
        boundField<Token>({ dataField: "content", headerText: "内容" }),
        dateTimeField<Token>({ headerText: "创建时间", dataField: "create_date_time" })
    ];


}
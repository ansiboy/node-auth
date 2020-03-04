import React = require("react");
import { boundField, dateTimeField } from "maishu-wuzhui-helper";
import { dataSources } from "../../services/data-sources";
import { rules } from "maishu-dilu";
import { TextInput, DataListPage } from "../../components/index";
import { DataControlField } from "maishu-wuzhui";
import { Role } from "gateway-entities";

export default class RoleListPage extends DataListPage<Role> {
    dataSource = dataSources.role;
    itemName: string = "角色";
    columns: DataControlField<Role>[] = [
        boundField<Role>({ dataField: 'id', headerText: '编号', headerStyle: { width: '320px' }, itemStyle: { textAlign: 'left' } }),
        boundField<Role>({ dataField: 'name', headerText: '名称' }),
        dateTimeField<Role>({ dataField: 'create_date_time', headerText: '创建时间' }),
    ];

    renderEditor() {
        return <>
            <div className="form-group clearfix input-control">
                <label>名称*</label>
                <span>
                    <TextInput<Role> dataType="string" dataField="name" placeholder="请输入角色名称"
                        validateRules={[
                            rules.required("请输入角色名称")
                        ]} />
                </span>
            </div>
            <div className="form-group clearfix input-control">
                <label>备注</label>
                <span>
                    <TextInput<Role> dataType="string" dataField="remark" placeholder="请输入备注" />
                </span>
            </div>
        </>
    }

}



// export default class RoleListPage extends React.Component {
//     roleTable: HTMLTableElement;
//     componentDidMount() {
//         createGridView({
//             element: this.roleTable,
//             dataSource: dataSources.role,
//             columns: [
//                 boundField({ dataField: 'id', headerText: '编号', headerStyle: { width: '300px' }, itemStyle: { textAlign: 'center' } }),
//                 boundField({ dataField: 'name', headerText: '名称' }),
//                 dateTimeField({ dataField: 'create_date_time', headerText: '创建时间' }),
//             ]
//         })
//     }
//     render() {
//         return <>
//             <table className="table table-striped table-bordered table-hover"
//                 ref={e => this.roleTable = e || this.roleTable} />
//         </>
//     }
// }

// let itemDialog = createItemDialog(dataSources.role, "角色", <>

// </>);


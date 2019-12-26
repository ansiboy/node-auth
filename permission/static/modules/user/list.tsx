import { dataSources, MyUser } from "../../services/data-sources";
import { DataSource, DataControlField, BoundField, GridViewCellControl, GridViewDataCell } from "maishu-wuzhui";
import { boundField, dateTimeField } from "maishu-wuzhui-helper";
import { DataListPage, errorHandle } from "maishu-chitu-admin/static";
import { GatewayService } from "services/gateway-service";
import ReactDOM = require("react-dom");
import React = require("react");
import { Role } from "gateway-entities";
import { ValueStore } from "maishu-chitu";

export default class UserListPage extends DataListPage<MyUser> {
    dataSource: DataSource<MyUser> = dataSources.user;
    itemName: string = "用户";
    columns: DataControlField<MyUser>[] = [
        boundField<MyUser>({ dataField: "mobile", headerText: "用户手机" }),
        boundField<MyUser>({ dataField: "user_name", headerText: "用户名", readOnly: true }),
        boundField<MyUser>({ dataField: "email", headerText: "邮箱" }),
        new RoleNamesField(),
        dateTimeField<MyUser>({ dataField: "create_date_time", headerText: "最后登录" }),
    ];
}

class RoleNamesField extends BoundField<MyUser> {
    private _roles: Role[];
    constructor() {
        super({
            dataField: "roleIds",
            headerText: "用户身份",
        })
    }

    private async roles() {
        if (this._roles == null) {
            let r = await dataSources.role.select();
            this._roles = r.dataItems;
        }
        return this._roles;
    }


    createControl() {

        let selectedIds: string[] = [];
        let element = document.createElement("div");
        let rolesComponent: RolesComponent;
        this.roles().then(roles => {
            ReactDOM.render(<RolesComponent roles={roles} selectedIds={selectedIds} ref={async (e) => {
                if (!e) return;

                rolesComponent = e;


            }} />, element);
        })


        return {
            element,
            get value() {
                if (rolesComponent != null)
                    return rolesComponent.state.selectedIds;

                return selectedIds;
            },
            set value(value) {
                if (rolesComponent != null)
                    rolesComponent.setState({ selectedIds });
                else
                    selectedIds = value;
            }
        };

    }

    createItemCell() {
        let it = this;
        let cell = new GridViewDataCell<MyUser>({
            async render(dataItem, element) {
                let roles = await it.roles();
                element.innerHTML = roles.filter(o => dataItem.roleIds.indexOf(o.id) >= 0)
                    .map(o => o.name).join(" ");
            }
        })

        return cell;
    }
}

class RolesComponent extends React.Component<{ selectedIds: string[], roles: Role[] }, { selectedIds: string[] }> {
    constructor(props) {
        super(props)

        this.state = { selectedIds: this.props.selectedIds };
    }
    render() {
        let { selectedIds } = this.state;
        let roles = this.props.roles;
        selectedIds = selectedIds || [];
        return <>
            {roles.map(o => <div key={o.id} className="checkbox">
                <label className="pull-left" style={{ marginRight: 10 }}>
                    <input type="checkbox" value={o.id} checked={selectedIds.indexOf(o.id) >= 0}
                        onChange={e => {
                            if (e.target.checked) {
                                selectedIds.push(e.target.value);
                            }
                            else {
                                selectedIds = selectedIds.filter(o => o != e.target.value);
                            }
                            this.setState({ selectedIds });
                        }} />
                    <span>{o.name}</span>
                </label>
            </div>)}
        </>
    }
}
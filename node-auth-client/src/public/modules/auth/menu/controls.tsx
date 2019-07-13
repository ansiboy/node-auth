import React = require("react");
import { ControlArguments } from "assert/index";
import { DropdownField } from "assert/index";
import { dataSources, translateToMenuItems } from "assert/dataSources";
import { TextInput as InputField } from "assert/index";
import { rules } from "maishu-dilu";
import { Resource } from "entities";
import { Buttons } from "assert/index";
import { errors } from "assert/errors";
import * as ui from "maishu-ui-toolkit";
import ReactDOM = require("react-dom");
import { createItemDialog } from "assert/index";
import { ArrayDataSource, DataSource } from "maishu-wuzhui";
import { PermissionService } from "assert/services/index";
import errorHandle from "error-handle";


let ps = new PermissionService((err) => errorHandle(err))

let menuItemDialog = createItemDialog(dataSources.resource, "菜单",
    <>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="name" label="名称*" placeholder="请输入名称"
                validateRules={[
                    rules.required("请输入名称")
                ]} />
        </div>
        <div className="form-group clearfix">
            <DropdownField<Resource, Resource> label={"所属菜单"} dataField="parent_id"
                nameField="name" valueField="id"
                placeholder="请选择所属菜单"
                dataSource={new DataSource({
                    select: async () => {
                        let dataItems = await ps.resource.list();
                        let menuItems = translateToMenuItems(dataItems);
                        menuItems = menuItems.filter(o => o.type == "menu" && o.parent == null);
                        // menuItems.forEach(o => {
                        //     if (o.parent == null) {
                        //         o.name = `|--- ${o.name}`
                        //     }
                        //     else if (o.parent.parent == null) {
                        //         o.name = `|------ ${o.name}`
                        //     }
                        // })
                        return { dataItems: menuItems, totalRowCount: menuItems.length }
                    }
                })} />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="page_path" label="路径" placeholder="请输入路径" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="icon" label="图标" placeholder="请输入图标" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="sort_number" label="序号" placeholder="用于排序" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="remark" label="备注" placeholder="请输入备注" />
        </div>
    </>,
    async (dataItem) => {
        dataItem.type = "menu";
    }
)

let controlResourceDialog = createItemDialog(dataSources.resource, "菜单",
    <>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="name" label="名称*" placeholder="请输入名称"
                validateRules={[
                    rules.required("请输入名称")
                ]} />
        </div>
        <div className="form-group clearfix">
            <DropdownField<Resource, Resource> label={"所属菜单"} dataField="parent_id"
                dataSource={dataSources.resource} nameField="name" valueField="id"
                placeholder="请选择所属菜单" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="page_path" label="路径" placeholder="请输入路径" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="sort_number" label="序号" placeholder="用于排序" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="remark" label="备注" placeholder="请输入备注" />
        </div>
    </>,
    async (dataItem) => {
        dataItem.type = "menu";
    }
)

function showMenuDialog(dataItem: Resource) {
    // if (dataItem.type == "menu")
    menuItemDialog.show(dataItem);
    // else if (dataItem.type == "control")
    //     controlResourceDialog.show(dataItem);
}


export default function (args: ControlArguments<Resource>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case Buttons.codes.add:
            control = document.createElement("div");
            ReactDOM.render(<button key={Math.random()} className="btn btn-primary pull-right"
                onClick={() => showMenuDialog({} as Resource)} >
                <i className="icon-plus" />
                <span>添加菜单</span>
            </button>, control);
            break;
        case Buttons.codes.edit:
            control = Buttons.createListEditButton(() => {
                showMenuDialog(args.dataItem);
            })
            break;
        case Buttons.codes.remove:
            control = Buttons.createListDeleteButton(() => {
                ui.confirm({
                    title: "提示", message: `确定删除菜单'${args.dataItem.name}'吗?`,
                    confirm: () => {
                        return dataSources.resource.delete(args.dataItem);
                    }
                })
            })
            break;
        case Buttons.codes.view:
            control = Buttons.createListViewButton(() => {
                menuItemDialog.show(args.dataItem);
            })
            break;
        case "add_control":
        case "添加控件":
            control = document.createElement("div");
            ReactDOM.render(<button key={Math.random()} className="btn btn-primary pull-right"
                onClick={() => {
                    controlResourceDialog.show({} as any)
                }} >
                <i className="icon-plus" />
                <span>添加控件</span>
            </button>, control);
            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;

}
import { ControlArguments, Buttons } from "assert/index";
import { dataSources } from "assert/dataSources";
import * as ui from "maishu-ui-toolkit";
import { Role } from "entities";

export default function (args: ControlArguments<Role>) {
    return Buttons.createListDeleteButton(() => {
        ui.confirm({
            title: "提示", message: `确定删除角色'${args.dataItem.name}'吗?`,
            confirm: () => {
                return dataSources.role.delete(args.dataItem);
            }
        })
    })
}

import { ControlArguments, Buttons } from "assert/index";
import { dataSources } from "assert/dataSources";
import { Resource } from "entities";
import * as ui from "maishu-ui-toolkit";

export default function (args: ControlArguments<Resource>) {
    let button = Buttons.createListDeleteButton(() => {
        ui.confirm({
            title: "提示", message: `确定删除角色'${args.dataItem.name}'吗?`,
            confirm: () => {
                return dataSources.resource.delete(args.dataItem);
            }
        })
    });

    return button;

}

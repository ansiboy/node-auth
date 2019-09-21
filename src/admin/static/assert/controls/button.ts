import { ControlArguments } from "assert/index";
import { errors } from "./errors";
import { buttonOnClick } from "maishu-ui-toolkit";
import { app } from "assert/application";

export default function (args: ControlArguments<any>): HTMLButtonElement {
    //TODO: 检查参数

    let buttonInfo = args.resource.data.button;
    if (buttonInfo == null)
        throw errors.resourceDataFieldMissing(args.resource, "button");

    let button = document.createElement("button");
    button.className = buttonInfo.className;

    let html = "";
    if (args.resource.icon) {
        html = html + `<i class="${args.resource.icon}"></i>`;
    }
    if (buttonInfo.showButtonText) {
        html = html + `<span>${args.resource.name}</span>`;
    }

    button.innerHTML = html;

    buttonOnClick(button, async () => {
        let executePath = buttonInfo.execute_path;
        if (!executePath)
            throw errors.buttonExecutePahtIsEmpty(args.resource);

        if (executePath.startsWith("func:")) {
            let methodName = executePath.substring("func:".length);
            if (!methodName)
                throw errors.executePathIncorrect(executePath);

            console.assert(args.context != null);
            if (args.context == null)
                throw errors.contextIsNull();

            if (!args.context[methodName])
                throw errors.contextMemberIsNotExist(methodName);

            if (typeof args.context[methodName] != "function")
                throw errors.contextMemberIsNotFunction(methodName);

            await args.context[methodName](args.dataItem);
        }
        else if (executePath.startsWith("#")) {
            let data = { resourceId: args.resource.id };
            if (args.dataItem.id)
                data["dataItemId"] = args.dataItem.id;

            app.redirect(executePath.substring(1), data);
        }
        else {
            throw errors.executePathIncorrect(executePath);
        }

    }, { toast: buttonInfo.toast })

    return button;


}
import React = require("react");
import { ControlArguments, Buttons } from "assert/index";
import { Role } from "entities";
import { errors } from "assert/errors";


export default function (args: ControlArguments<Role>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case Buttons.codes.add:
            control = Buttons.createPageAddButton(async () => {
                // itemDialog.show(args.dataItem);
                alert("add totoken")
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;

}
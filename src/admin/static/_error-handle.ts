import { Application } from "assert/application";
import { Page } from "maishu-chitu-react";
import * as ui from "maishu-ui-toolkit";

let errorMessages = {
    "726": "没有权限访问"
}

export default function errorHandle(error: Error, app?: Application, page?: Page) {
    error.message = errorMessages[error.name] || error.message;

    ui.alert({
        title: "错误",
        message: error.message
    })
}

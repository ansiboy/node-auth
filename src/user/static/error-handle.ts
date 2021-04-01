import { Application } from "maishu-chitu-react";
import * as ui from "maishu-ui-toolkit";

let errorMessages: { [key: string]: string } = {
    "726": "没有权限访问"
}

export function errorHandle(error: Error, app?: Application) {
    error.message = errorMessages[error.name] || error.message;
    if (error.name == "718" && app != null) {
        // app.redirect("login");
        location.hash = "#login";
        return;
    }
    ui.alert({
        title: "错误",
        message: error.message
    })
}



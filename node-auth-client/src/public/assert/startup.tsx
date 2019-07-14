import { Application, app } from "./application";
import ReactDOM = require("react-dom");
import { SimpleMasterPage } from "./masters/simple-master-page";
import { MainMasterPage, MenuItem } from "./masters/main-master-page";
import React = require("react");
import { MasterPage } from "./masters/master-page";
import { PermissionService } from "./services/index";
import { config } from '../config';
import { ValueStore } from "maishu-chitu";

PermissionService.baseUrl = config.permissionServiceUrl;

export default function startup() {
    async function createMasterPages(app: Application): Promise<{ simple: HTMLElement, main: HTMLElement }> {
        return new Promise<{ simple: HTMLElement, main: HTMLElement }>((resolve, reject) => {
            let container = document.createElement('div')

            ReactDOM.render(<SimpleMasterPage app={app} ref={e => masterPages.simple = e || masterPages.simple} />, document.getElementById('simple-master'))
            ReactDOM.render(<MainMasterPage app={app} ref={e => masterPages.default = e || masterPages.default} />, document.getElementById('main-master'))
            document.body.appendChild(container)
        })
    }

    let masterPages = {
        simple: null as MasterPage<any>,
        default: null as MainMasterPage
    }

    createMasterPages(app);
    loadStyle();

    app.masterPages = masterPages;
    app.run();

}

/** 加载样式文件 */
function loadStyle() {
    let str: string = require('text!../content/admin_style_default.less')
    if (config.firstPanelWidth) {
        str = str + `\r\n@firstPanelWidth: ${config.firstPanelWidth}px;`
    }

    if (config.secondPanelWidth) {
        str = str + `\r\n@secondPanelWidth: ${config.secondPanelWidth}px;`
    }

    let less = (window as any)['less']
    less.render(str, function (e: Error, result: { css: string }) {
        if (e) {
            console.error(e)
            return
        }

        let style = document.createElement('style')
        document.head.appendChild(style)
        style.innerText = result.css
    })
}



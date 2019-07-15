import { MenuItem } from "assert/masters/main-master-page";
import { Resource } from "entities";
import { errors } from "./errors";

export type PageViewArguments = {
    element: HTMLElement,
    menuItems: MenuItem[],
    resourceId: string,
    // render?: (element: HTMLElement) => void,
    context?: object,
    showBackButton?: boolean,
}

export class PageView {
    protected backButton: HTMLButtonElement;
    protected navBar: HTMLUListElement;
    protected args: PageViewArguments;

    constructor(args: PageViewArguments) {

        this.args = args;
        let resource = args.menuItems.filter(o => o.id == args.resourceId)[0];
        console.assert(resource != null);

        this.initElement(args, resource);
        // this.createBody(args);

        if (args.showBackButton)
            this.showBackButton();

        this.loadTopControls(args).then(controls => {
            controls.reverse();
            controls.map(ctrl => {
                let li = document.createElement("li");
                li.className = "pull-right";
                li.appendChild(ctrl);
                return li;

            }).forEach(li => {
                this.navBar.appendChild(li);
            })
        })
    }

    // private createBody(args: PageViewArguments) {
    //     let body = document.createElement("div");
    //     args.element.appendChild(body);
    //     this.render(body);

    //     return body;
    // }

    protected showBackButton() {
        this.backButton.style.removeProperty("display");
    }

    private initElement(args: PageViewArguments, menuItem: MenuItem) {
        let { element } = args;
        element.innerHTML = `
        <div class="tabbable">
            <ul class="nav nav-tabs" style="min-height:34">
                <li className="pull-left">
                    <div style="font-weight: bold; font-size: 16px">${menuItem.name}</div>
                </li>
                <li class="pull-right">
                    <button class="btn btn-primary pull-right" style="display:none;">
                        <i class="icon-reply"></i>
                        <span>返回</span>
                    </button>
                </li>
            </ul>
        </div>
        `

        this.backButton = element.querySelector("button");
        this.backButton.onclick = () => history.back();
        this.navBar = args.element.querySelector("ul");
    }

    // protected render(element: HTMLElement) {
    //     if (this.args.render)
    //         this.args.render(element);
    // }



    private async loadTopControls(args: PageViewArguments): Promise<HTMLElement[]> {
        let resource_id = args.resourceId;
        if (!resource_id) return null

        let resources = args.menuItems;
        let menuItem = resources.filter(o => o.id == resource_id)[0];
        console.assert(menuItem != null)
        let menuItemChildren = resources.filter(o => o.parent_id == menuItem.id);
        let controlResources = menuItemChildren.filter(o => o.data != null && o.data.position == "top-right");
        let controlFuns = await Promise.all(controlResources.map(o => loadControlModule(o.page_path)));

        let controls = controlFuns.map((func, i) => func({ resource: controlResources[i], dataItem: {}, context: args.context }));
        return controls;
    }
}


export interface ControlArguments<T> {
    resource: Resource;
    dataItem: T;
    context: object
}


export function loadControlModule<T>(path: string): Promise<(args: ControlArguments<T>) => HTMLElement> {
    if (path.endsWith(".js"))
        path = path.substr(0, path.length - 3)

    return new Promise((resolve, reject) => {
        requirejs([path],
            function (mod) {
                if (mod == null)
                    throw errors.moduleIsNull(path);

                let defaultExport = mod["default"];
                if (!defaultExport)
                    throw errors.moduleHasNoneDefaultExports(path);

                if (typeof defaultExport != 'function')
                    throw errors.moduleHasDefaultExportIsNotFunction(path);

                // defaultExport(args);
                resolve(defaultExport);
            },
            function (err) {
                let msg = `Load module ${path} fail.`
                let error = new Error(msg);
                error["innerError"] = err;
                reject(error);
                console.log(error);
            }
        )
    })
}

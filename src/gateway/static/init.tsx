import { InitArguments, RequireJS, WebsiteConfig, Application } from "maishu-chitu-admin/static";
import { PageData } from "maishu-chitu";
import { PermissionService } from "./services/permission-service";
import { RequireConfig } from "maishu-chitu-admin/static";
import websiteConfig = require("json!websiteConfig");
import { GatewayService } from "./services/gateway-service";
import React = require("react");
import { pathConcat } from "maishu-toolkit";


type StationPageLoaders = { [path: string]: StationPageLoader };

export default async function (args: InitArguments) {

    let permissionService = args.app.createService(PermissionService);
    let gatewayService = args.app.createService(GatewayService);
    let stations = await gatewayService.stationList();

    let stationPaths = stations.filter(o => formatStationRoot(o.path)).map(o => o.path);
    let stationPageLoaders: StationPageLoaders = {};
    for (let i = 0; i < stationPaths.length; i++) {
        stationPageLoaders[stationPaths[i]] = new StationPageLoader(stationPaths[i], args.app);
    }

    rewriteApplication(args.app, stationPageLoaders);

    PermissionService.token.attach(async token => {
        if (!token) {
            args.mainMaster.setMenu(...[]);
            args.mainMaster.setToolbar(<></>);
            return;
        }

        let [menuItems, me, myRoles] = await Promise.all([
            gatewayService.myMenuItems(),
            permissionService.me(),
            gatewayService.myRoles(),
        ]);

        let stack = [...menuItems];
        while (stack.length > 0) {
            let menuItem = stack.shift();

            if (menuItem.path != null && menuItem.path.startsWith("#")) {
                let path = menuItem.path.substr(1);
                let stationPath: string = menuItem["stationPath"];
                if (stationPath) {
                    console.assert(stationPath != null);
                    if (stationPath.startsWith("/")) {
                        stationPath = stationPath.substr(1);
                    }
                    if (stationPath.endsWith("/")) {
                        stationPath = stationPath.substr(0, stationPath.length - 1);
                    }

                    menuItem.path = `#/${stationPath}/${path}`;
                }
                else {
                    menuItem.path = `#${path}`;
                }

            }

            (menuItem.children || []).forEach(child => {
                stack.unshift(child);
            })
        }

        args.mainMaster.setMenu(...menuItems);

        args.mainMaster.setToolbar(<ul style={{ color: "white", margin: "4px 10px 0" }}>
            <li className="pull-right" style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => logout(gatewayService, args.app)}>
                <i className="icon-off" style={{ marginRight: 4 }} />
                <span>退出</span>
            </li>
            <li className="pull-right">
                <span className="user-name">
                    {me.mobile || me.user_name}({myRoles.map(o => o.name)})
                </span>
            </li>
        </ul>);
    })
}

async function logout(gs: GatewayService, app: Application) {
    gs.logout();
    PermissionService.token.value = "";
    location.href = "login";
}


async function rewriteApplication(app: InitArguments["app"], stationPageLoaders: StationPageLoaders) {
    console.assert(app != null);
    let showPage = app.showPage;
    app.showPage = function (pageUrl: string, args?: PageData, forceRender?: boolean) {
        args = args || {};
        let d = this.parseUrl(pageUrl);
        let names = ['login', 'forget-password', 'register']
        if (names.indexOf(d.pageName) >= 0) {
            args.container = 'simple'
        }

        return showPage.apply(this, [pageUrl, args, forceRender]);
    }

    console.assert(app["loadjs"] != null);
    app["loadjs"] = function (path: string) {
        if (path.startsWith("modules/")) {
            path = path.substring("modules/".length);
        }

        // let contextName: string;
        let stationPath = getStationRoot(path);
        if (stationPath) {
            // contextName = stationPath;
            let pagePath = path.substring(stationPath.length);
            path = pathConcat(stationPath, "modules", pagePath);
        }
        else {
            path = pathConcat("modules", path);
        }

        // if (contextName) {
        //     let stationPageLoader = stationPageLoaders[contextName];
        //     console.assert(stationPageLoader != null);
        //     return stationPageLoader.loadUrl(path);
        // }

        return new Promise<any>((reslove, reject) => {
            requirejs([path],
                function (result: any) {
                    reslove(result);
                },
                function (err: Error) {
                    reject(err);
                });
        });
    }
}

function getStationRoot(path: string) {


    if (path[0] == "/") {
        let arr = path.substr(1).split("/");
        let stationPath = formatStationRoot(arr[0]);
        return stationPath;
    }

    return null;
}

function formatStationRoot(stationPath: string) {
    if (stationPath.startsWith("/") == false) {
        stationPath = "/" + stationPath;
    }
    if (stationPath.endsWith("/") == false) {
        stationPath = stationPath + "/";
    }

    return stationPath;
}

class StationPageLoader {
    private stationPath: string;
    private app: Application;

    private status: "success" | "doing" | "fail" = "fail";
    private requirejs: RequireJS;

    private promises: {
        [path: string]: {
            resolve: Function, reject: Function,
            promise: Promise<any>
        }
    } = {};

    constructor(stationPath: string, app: InitArguments["app"]) {
        this.stationPath = stationPath;
        this.app = app;

        if (this.stationPath == websiteConfig.requirejs.baseUrl) {
            this.status = "success";
            this.requirejs = this.configRequirejs(websiteConfig);
            console.assert(this.requirejs != null);
        }

        // this.start();
    }

    private configRequirejs(stationWebsiteConfig: WebsiteConfig) {
        stationWebsiteConfig.requirejs = stationWebsiteConfig.requirejs || {} as RequireConfig;
        stationWebsiteConfig.requirejs.context = stationWebsiteConfig.requirejs.context || this.stationPath;
        // stationWebsiteConfig.requirejs.baseUrl = this.stationPath;
        stationWebsiteConfig.requirejs.paths = stationWebsiteConfig.requirejs.paths || {};
        let req = requirejs.config(stationWebsiteConfig.requirejs);
        return req;
    }

    loadUrl(url: string): Promise<any> {
        if (this.status == "success") {
            return new Promise((resolve, reject) => {
                this.requirejs([url], (obj) => resolve(obj), err => reject(err));
            })
        }
        else if (this.status == "fail") {
            this.start();
        }

        if (this.promises[url]) {
            return this.promises[url].promise;
        }

        this.promises[url] = {} as any;
        let p = new Promise((resolve, reject) => {
            this.promises[url].reject = reject;
            this.promises[url].resolve = resolve;
        })

        this.promises[url].promise = p;

        return p;
    }

    private onStartSuccess() {
        let urlsToLoad = Object.getOwnPropertyNames(this.promises);
        urlsToLoad.forEach(url => {
            this.requirejs([url], (obj) => {
                this.promises[url].resolve(obj);
            }, (err) => {
                this.promises[url].reject(err);
            });
        })
    }

    private start() {
        if (this.status == "success" || this.status == "doing") {
            return;
        }

        fetch(`websiteConfig?station=${this.stationPath}`).then(async response => {
            let stationWebsiteConfig = await response.json();
            this.requirejs = this.configRequirejs(stationWebsiteConfig);

            let contextName = stationWebsiteConfig.requirejs.context;
            console.assert(contextName != null, `Context of site '${this.stationPath}' requirejs config is null`);
            let clientjsInitPath = `clientjs_init`;
            console.log(`Clinet init js file path ${clientjsInitPath}.`);
        })
    }
}



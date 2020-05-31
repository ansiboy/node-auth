import { InitArguments, RequireJS, WebsiteConfig, Application } from "maishu-chitu-admin/static";
import { PageData } from "maishu-chitu";
import { PermissionService } from "./services/permission-service";
import { RequireConfig } from "maishu-chitu-admin/static";
import websiteConfig = require("json!websiteConfig");
import { GatewayService } from "./services/gateway-service";
import React = require("react");


type StationPageLoaders = { [path: string]: StationPageLoader };

export default async function (args: InitArguments) {

    let permissionService = args.app.createService(PermissionService);
    let gatewayService = args.app.createService(GatewayService);
    let stations = await gatewayService.stationList();

    let stationPaths = stations.filter(o => o.path).map(o => o.path);
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
                console.assert(stationPath != null);
                if (stationPath.startsWith("/")) {
                    stationPath = stationPath.substr(1);
                }
                if (stationPath.endsWith("/")) {
                    stationPath = stationPath.substr(0, stationPath.length - 1);
                }

                menuItem.path = `#${stationPath}:${path}`;
            }
            else if (menuItem.path != null && menuItem.path.startsWith(":")) {
                menuItem.path = `#${menuItem.path.substr(1)}`;
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
                <span>
                    {me.mobile || me.user_name}({myRoles.map(o => o.name)})
                </span>
            </li>
        </ul>);
    })
}

async function logout(gs: GatewayService, app: Application) {
    gs.logout();
    PermissionService.token.value = "";
    // app.redirect("login");
    location.href = "#login";
}


async function rewriteApplication(app: InitArguments["app"], stationPageLoaders: StationPageLoaders) {
    console.assert(app != null);
    let showPage = app.showPage;
    app.showPage = function (pageUrl: string, args?: PageData, forceRender?: boolean) {

        if (pageUrl.indexOf(":") < 0 && location.hash.length > 1) {
            let stationPath = getStationPath(location.hash.substr(1));
            if (stationPath) {
                stationPath = stationPath.substr(1, stationPath.length - 2);
                pageUrl = stationPath + ":" + pageUrl;
            }
        }

        args = args || {};
        let d = this.parseUrl(pageUrl)
        let names = ['login', 'forget-password', 'register']
        if (names.indexOf(d.pageName) >= 0) {
            args.container = 'simple'
        }

        return showPage.apply(this, [pageUrl, args, forceRender]);
    }

    console.assert(app["loadjs"] != null);
    app["loadjs"] = function (path: string) {

        const modulesPath = "modules/";
        console.assert(path.startsWith(modulesPath));
        path = path.substr(modulesPath.length);

        let contextName: string;
        let stationPath = getStationPath(path);
        if (stationPath) {
            let arr = path.split(":");
            path = `${stationPath}${modulesPath}${arr[1]}`;
            contextName = stationPath;
        }
        else {
            path = modulesPath + path;
            contextName = websiteConfig.requirejs.baseUrl;
        }

        return stationPageLoaders[contextName].loadUrl(path);
    }
}

function getStationPath(path: string) {
    if (path.indexOf(":") >= 0) {
        let arr = path.split(":");
        let stationPath = arr[0];
        if (stationPath.startsWith("/") == false) {
            stationPath = "/" + stationPath;
        }
        if (stationPath.endsWith("/") == false) {
            stationPath = stationPath + "/";
        }

        return stationPath;
    }

    return null;
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
        stationWebsiteConfig.requirejs.baseUrl = this.stationPath;
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

        let path = this.stationPath;
        fetch(`${path}websiteConfig`).then(async response => {
            let stationWebsiteConfig = await response.json();
            this.requirejs = this.configRequirejs(stationWebsiteConfig);

            let contextName = stationWebsiteConfig.requirejs.context;
            console.assert(contextName != null, `Context of site '${path}' requirejs config is null`);
            let clientjsInitPath = `clientjs_init`;
            console.log(`Clinet init js file path ${clientjsInitPath}.`);

            this.requirejs([clientjsInitPath],
                (initModule) => {
                    if (initModule && typeof initModule.default == 'function') {
                        let args: InitArguments = {
                            app: this.app, mainMaster: null,
                            requirejs: this.requirejs
                        };

                        let result = initModule.default(args) as Promise<any>;
                        if (result != null && result.then != null) {
                            result.then(() => {
                                this.status = "success";
                                this.onStartSuccess();
                            }).catch(err => {
                                console.error(err);
                                this.status = "fail";
                            })

                            return;
                        }
                        else {
                            this.status = "success";
                            this.onStartSuccess();
                        }
                    }
                },
                (err) => {
                    console.error(err);
                    this.status = "fail";
                }
            )
        })
    }
}
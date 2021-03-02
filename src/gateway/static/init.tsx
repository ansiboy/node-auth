import { InitArguments, RequireJS, WebsiteConfig, Application } from "maishu-chitu-admin/static";
import { PageData } from "maishu-chitu";
import { PermissionService } from "./services/permission-service";
import { RequireConfig } from "maishu-chitu-admin/static";
import { GatewayService } from "./services/gateway-service";
import React = require("react");
import { pathConcat } from "maishu-toolkit";
import { Station } from "gateway-entities";


type StationPageLoaders = { [path: string]: StationPageLoader };

export default async function (args: InitArguments) {

    let permissionService = args.app.createService(PermissionService);
    let gatewayService = args.app.createService(GatewayService);
    let stations = await gatewayService.stationList();

    let stationPageLoaders: StationPageLoaders = {};
    for (let i = 0; i < stations.length; i++) {
        stationPageLoaders[stations[i].path] = new StationPageLoader(stations[i]);
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
    location.href = "#login";
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

        let stationPath = getStationRoot(path);
        if (stationPath) {
            let pagePath = path.substring(stationPath.length);
            path = pathConcat(stationPath, "modules", pagePath);
        }
        else {
            path = pathConcat("modules", path);
        }

        if (stationPath) {
            let stationPageLoader = stationPageLoaders[stationPath];
            console.assert(stationPageLoader != null);
            return stationPageLoader.loadUrl(path);
        }

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
    private stationInfo: Station;
    private requirejs: RequireJS;

    constructor(stationInfo: Station) {
        this.stationInfo = stationInfo;
    }

    private configRequirejs(stationWebsiteConfig: WebsiteConfig) {
        stationWebsiteConfig.requirejs = stationWebsiteConfig.requirejs || {} as RequireConfig;
        stationWebsiteConfig.requirejs.paths = stationWebsiteConfig.requirejs.paths || {};
        let req = requirejs.config(stationWebsiteConfig.requirejs);
        return req;
    }

    async loadUrl(url: string): Promise<any> {

        if (!this.requirejs) {
            let websiteConfig = await this.getWebsiteConfig(this.stationInfo);
            this.requirejs = this.configRequirejs(websiteConfig);
        }

        return new Promise((resolve, reject) => {
            this.requirejs([url], (obj) => resolve(obj), err => reject(err));
        })

    }

    private getWebsiteConfig(stationInfo: Station) {
        return new Promise<WebsiteConfig>((resolve, reject) => {
            let websiteConfigPath = pathConcat(this.stationInfo.path, this.stationInfo.config || "website-config");
            fetch(websiteConfigPath).then(async response => {
                let stationWebsiteConfig = await response.json();
                stationWebsiteConfig.requirejs.context = stationInfo.path;
                stationWebsiteConfig.requirejs.baseUrl = stationInfo.path;
                resolve(stationWebsiteConfig);
            }).catch(err => {
                reject(err);
            })
        })
    }
}



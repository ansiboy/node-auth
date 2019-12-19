import { InitArguments, RequireJS } from "maishu-chitu-admin/static";
import { PageData, Application } from "maishu-chitu";
import { PermissionService } from "services/permission-service";
import { WebsiteConfig, RequireConfig } from "maishu-chitu-admin/static";
import { errors } from "./errors";
// import config from "config";
import websiteConfig = require("json!websiteConfig");
import { GatewayService } from "services/gateway-service";
import React = require("react");

export default async function (args: InitArguments) {

    let permissionService = args.app.createService(PermissionService);
    let gatewayService = args.app.createService(GatewayService);
    let stations = await gatewayService.stationList();

    let stationPaths = stations.filter(o => o.path != websiteConfig.stationPath).map(o => o.path);
    rewriteApplication(args.app, stationPaths);

    await initStations(stationPaths, args);


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
    app.redirect("login");
}


async function rewriteApplication(app: InitArguments["app"], stationPaths: string[]) {
    console.assert(app != null);
    let showPage = app.showPage;
    app.showPage = function (pageUrl: string, args?: PageData, forceRender?: boolean) {
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

        // let req: RequireJS = requirejs;
        let contextName: string;
        if (path.indexOf(":") >= 0) {
            let arr = path.split(":");
            let stationPath = arr[0];
            if (stationPath.startsWith("/") == false) {
                stationPath = "/" + stationPath;
            }
            if (stationPath.endsWith("/") == false) {
                stationPath = stationPath + "/";
            }

            path = `${stationPath}${modulesPath}${arr[1]}`;
            // req = contextRequireJSs[stationPath];
            contextName = stationPath;
            // console.assert(req != null);
        }
        else {
            path = modulesPath + path;
            // req = requirejs;
        }

        return new Promise<any>((reslove, reject) => {
            requirejs({ context: contextName }, [path],
                function (result: any) {
                    reslove(result);
                },
                function (err: Error) {
                    reject(err);
                });
        });
    }
}

let contextRequireJSs: { [path: string]: RequireJS } = {};

async function initStations(stationPaths: string[], initArguments: InitArguments): Promise<{ [path: string]: WebsiteConfig }> {

    if (stationPaths == null)
        throw errors.argumentNull("paths");

    for (let i = 0; i < stationPaths.length; i++) {
        console.assert(stationPaths[i] != null, `paths[${i}] is null`);
        if (stationPaths[i][0] != "/") {
            stationPaths[i] = "/" + stationPaths[i];
        }

        if (stationPaths[i][stationPaths[i].length - 1] != "/") {
            stationPaths[i] = stationPaths[i] + "/";
        }
    }

    //let stationAbsolutePaths = stationPaths.map(path => `${websiteConfig.protocol}//${websiteConfig.gateway}${path}`);

    let result: { [path: string]: WebsiteConfig } = {};
    let responses = await Promise.all(stationPaths.map(path => fetch(`${path}websiteConfig`)))
    let stationWebsiteConfigs: WebsiteConfig[] = await Promise.all(responses.map(r => r.json()));
    for (let i = 0; i < stationPaths.length; i++) {
        let stationWebsiteConfig = stationWebsiteConfigs[i];

        stationWebsiteConfig.requirejs = stationWebsiteConfig.requirejs || {} as RequireConfig;
        stationWebsiteConfig.requirejs.context = stationWebsiteConfig.requirejs.context || stationPaths[i];
        stationWebsiteConfig.requirejs.baseUrl = `${stationPaths[i]}`;//stationPaths[i];
        stationWebsiteConfig.requirejs.paths = stationWebsiteConfig.requirejs.paths || {};

        stationWebsiteConfig.requirejs.paths = Object.assign({}, defaultPaths, stationWebsiteConfig.requirejs.paths);
        // stationWebsiteConfig.requirejs.paths[`clientjs_init`] = `http://${websiteConfig.gateway}${stationPaths[i]}clientjs_init`

        contextRequireJSs[stationPaths[i]] = requirejs.config(stationWebsiteConfig.requirejs);
        result[stationPaths[i]] = stationWebsiteConfig;
    }

    await Promise.all(stationPaths.map((path, i) =>

        new Promise((resolve, reject) => {
            let contextName = stationWebsiteConfigs[i].requirejs.context;
            console.assert(contextName != null, `Context of site '${path}' requirejs config is null`);
            let clientjsInitPath = `clientjs_init`;
            console.log(`Clinet init js file path ${clientjsInitPath}.`)
            requirejs({ context: contextName }, [clientjsInitPath],
                (initModule) => {
                    if (initModule && typeof initModule.default == 'function') {
                        let args: InitArguments = {
                            app: initArguments.app, mainMaster: null,
                            requirejs: contextRequireJSs[path]
                        };

                        let result = initModule.default(args) as Promise<any>;
                        if (result != null && result.then != null) {
                            result.then(() => {
                                resolve();
                            }).catch(err => {
                                reject(err);
                            })

                            return;
                        }

                        resolve();
                    }
                },
                function (err) {
                    reject(err);
                }
            )
        })
    ));

    return result;
}

let node_modules = '/node_modules';
let lib = 'assert/lib';

let defaultPaths = {
    css: `${lib}/css`,
    less: `${lib}/require-less-0.1.5/less`,
    lessc: `${lib}/require-less-0.1.5/lessc`,
    normalize: `${lib}/require-less-0.1.5/normalize`,
    text: `${lib}/text`,

    jquery: `${lib}/jquery-2.1.3`,
    "jquery.event.drag": `${lib}/jquery.event.drag-2.2/jquery.event.drag-2.2`,
    "jquery.event.drag.live": `${lib}/jquery.event.drag-2.2/jquery.event.drag.live-2.2`,

    "js-md5": `${node_modules}/js-md5/src/md5`,

    pin: `${lib}/jquery.pin/jquery.pin.min`,

    "react": `${node_modules}/react/umd/react.development`,
    "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
    "maishu-chitu": `${node_modules}/maishu-chitu/dist/index`,
    "maishu-chitu-admin/static": `${node_modules}/maishu-chitu-admin/out/static/index`,
    "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index`,
    "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index`,
    "maishu-dilu": `${node_modules}/maishu-dilu/dist/index`,
    "maishu-services-sdk": `${node_modules}/maishu-services-sdk/dist/index`,
    "maishu-image-components": `${node_modules}/maishu-image-components/index`,
    "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`,
    "maishu-node-auth": `${node_modules}/maishu-node-auth/dist/client/index`,
    "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index`,
    "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index`,
    "swiper": `${node_modules}/swiper/dist/js/swiper`,
    "xml2js": `${node_modules}/xml2js/lib/xml2js`,
    "polyfill": `${node_modules}/@babel/polyfill/dist/polyfill`,
    "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
}
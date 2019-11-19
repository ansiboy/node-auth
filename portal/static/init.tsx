import { InitArguments, RequireJS } from "maishu-chitu-admin/static";
import { PageData } from "maishu-chitu";
import { PermissionService } from "services/permission-service";
import { WebsiteConfig, RequireConfig } from "maishu-chitu-admin/static";
import { errors } from "./errors";
import config from "config";
import websiteConfig = require("json!websiteConfig");

export default async function (args: InitArguments) {


    let lib = "./lib";
    requirejs.config({
        paths: {
            qrcode: `${lib}/qrcode`,
        }
    })

    let s = args.app.createService(PermissionService);
    let stations = await s.stationList();

    let stationPaths = stations.filter(o => o.path != websiteConfig.stationPath).map(o => o.path);

    rewriteApplication(args.app, stationPaths);

    let r = await initStations(stationPaths, args);

    let menuItems: WebsiteConfig["menuItems"] = [];
    for (let i = 0; i < stationPaths.length; i++) {
        let config = r[stationPaths[i]];
        console.assert(config != null);

        let stack = [...config.menuItems];
        while (stack.length > 0) {
            let menuItem = stack.shift();

            if (menuItem.path != null && menuItem.path.startsWith("#")) {
                let path = menuItem.path.substr(1);
                console.assert(stationPaths[i].startsWith("/"), `Station path ${stationPaths[i]} not starts with '/'`);
                console.assert(stationPaths[i].endsWith("/"), `Station path ${stationPaths[i]} not ends with '/'`);
                menuItem.path = `#${stationPaths[i]}${path}`;
            }

            (menuItem.children || []).forEach(child => {
                stack.unshift(child);
            })
        }

        menuItems.push(...config.menuItems);
    }

    args.mainMaster.setMenu(...menuItems);
}


async function rewriteApplication(app: InitArguments["app"], stationPaths: string[]) {
    console.assert(app != null);
    // let stationAbsolutePaths = stationPaths.map(path => `${config.protocol}//${websiteConfig.gateway}${path}`);
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

    app.loadjs = function (path: string) {

        const modulesPath = "modules/";
        console.assert(path.startsWith(modulesPath));
        path = path.substr(modulesPath.length);

        let reqConfig: RequireConfig = {};
        let req: RequireJS = requirejs;
        for (let i = 0; i < stationPaths.length; i++) {
            // let stationPathIndex = path.indexOf(stationPaths[i]);
            if (!path.startsWith(stationPaths[i])) //(stationPathIndex < 0)
                continue;

            // let str1 = stationPathIndex > 0 ? path.substr(0, stationPathIndex) : "";
            // let str2 = path.substr(stationPathIndex + stationPaths[i].length);
            // path = stationPaths[i] + str1 + str2;

            path = path.substr(stationPaths[i].length);
            path = `${stationPaths[i]}${modulesPath}${path}`;

            reqConfig.context = stationPaths[i];
            req = contextRequireJSs[stationPaths[i]];
        }

        return new Promise<any>((reslove, reject) => {
            req([path],
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

    let stationAbsolutePaths = stationPaths.map(path => `${config.protocol}//${websiteConfig.gateway}${path}`);

    let result: { [path: string]: WebsiteConfig } = {};
    let responses = await Promise.all(stationAbsolutePaths.map(path => fetch(`${path}websiteConfig`)))
    let stationWebsiteConfigs: WebsiteConfig[] = await Promise.all(responses.map(r => r.json()));
    for (let i = 0; i < stationPaths.length; i++) {
        let stationWebsiteConfig = stationWebsiteConfigs[i];

        stationWebsiteConfig.requirejs = stationWebsiteConfig.requirejs || {} as RequireConfig;
        console.assert(stationWebsiteConfig.requirejs.context != null);
        stationWebsiteConfig.requirejs.baseUrl = `http://${websiteConfig.gateway}${stationPaths[i]}`;//stationPaths[i];
        stationWebsiteConfig.requirejs.paths = stationWebsiteConfig.requirejs.paths || {};

        stationWebsiteConfig.requirejs.paths = Object.assign({}, defaultPaths, stationWebsiteConfig.requirejs.paths);
        // stationWebsiteConfig.requirejs.paths[`clientjs_init`] = `http://${websiteConfig.gateway}${stationPaths[i]}clientjs_init`

        contextRequireJSs[stationPaths[i]] = requirejs.config(stationWebsiteConfig.requirejs);
        result[stationPaths[i]] = stationWebsiteConfig;
    }

    // for (let i = 0; i < stationPaths.length; i++) {
    //     paths[stationPaths[i]] = stationAbsolutePaths[i];
    // }

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

let node_modules = 'node_modules';
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
    "maishu-chitu-admin": `${node_modules}/maishu-chitu-admin/dist/chitu_admin`,
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
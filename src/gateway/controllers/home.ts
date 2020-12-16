import { action, controller, request, routeData } from "maishu-node-mvc";
import http = require("http");
import url = require("url");
import { WebsiteConfig } from "maishu-chitu-admin";
import { pathConcat } from "maishu-toolkit";
import { g } from "../global";
import gatewayWebsiteConfig from "../website-config";
import fetch from "node-fetch";

@controller("/")
export default class HomeController {
    @action()
    async websiteConfig(@request req: http.IncomingMessage, @routeData d: { station: string }) {
        let p = g.stationInfos.value.filter(o => o.path == d.station)[0];
        let r: WebsiteConfig;
        if (!p) {
            r = gatewayWebsiteConfig;
        }
        else {
            let configPath = p.config || "websiteConfig";
            let url = pathConcat(`http://${p.ip}:${p.port}/`, configPath);
            r = await new Promise<WebsiteConfig>((resolve, reject) => {
                fetch(url)
                    .then(r => r.json())
                    .then(o => resolve(o))
                    .catch(err => {
                        console.info(err);
                        resolve({});
                    });
            })
        }

        r = Object.assign({ requirejs: {}, menuItems: [] } as WebsiteConfig, r);
        r.requirejs.paths = Object.assign(defaultPaths, r.requirejs.paths || {});
        r.requirejs.shim = Object.assign(defaultShim, r.requirejs.shim || {});
        if (p) {
            r.requirejs.context = p.path;
            // r.requirejs.baseUrl = p.path;
        }

        return r;
    }

}

let node_modules = '/node_modules';
let lib = 'lib';
let defaultShim = {
    "react-dom": {
        deps: ["react"]
    }
};
let defaultPaths = {
    css: `${node_modules}/maishu-requirejs-plugins/lib/css`,
    lessjs: `${node_modules}/less/dist/less`,
    less: `${lib}/require-less-0.1.5/less`,
    lessc: `${lib}/require-less-0.1.5/lessc`,
    normalize: `${lib}/require-less-0.1.5/normalize`,

    text: `${node_modules}/maishu-requirejs-plugins/lib/text`,
    json: `${node_modules}/maishu-requirejs-plugins/src/json`,
    noext: `${node_modules}/maishu-requirejs-plugins/src/noext`,

    jquery: `${lib}/jquery-2.1.3`,
    "jquery.event.drag": `${lib}/jquery.event.drag-2.2/jquery.event.drag-2.2`,
    "jquery.event.drag.live": `${lib}/jquery.event.drag-2.2/jquery.event.drag.live-2.2`,

    "js-md5": `${node_modules}/js-md5/src/md5`,

    pin: `${lib}/jquery.pin/jquery.pin.min`,

    "react": `${node_modules}/react/umd/react.development`,
    "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
    "maishu-chitu": `${node_modules}/maishu-chitu/dist/index.min`,
    "maishu-chitu-admin/static": `${node_modules}/maishu-chitu-admin/dist/static.min`,
    "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index.min`,
    "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index.min`,
    "maishu-dilu": `${node_modules}/maishu-dilu/dist/index.min`,
    "maishu-services-sdk": `${node_modules}/maishu-services-sdk/dist/index`,
    "maishu-image-components": `${node_modules}/maishu-image-components/index`,
    "maishu-toolkit": `${node_modules}/maishu-toolkit/dist/index.min`,
    "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index.min`,
    "maishu-node-auth": `${node_modules}/maishu-node-auth/dist/client/index`,
    "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index.min`,
    "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index.min`,
    "swiper": `${node_modules}/swiper/dist/js/swiper`,
    "xml2js": `${node_modules}/xml2js/lib/xml2js`,
    "polyfill": `${node_modules}/@babel/polyfill/dist/polyfill`,
    "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,

    "admin_style_default": "content/admin_style_default.less",
};



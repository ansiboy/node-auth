import { startServer } from 'maishu-node-mvc'
// import { settings } from './settings';
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, SettingsHeaderName } from './settings';

interface Config {
    port: number,
    gateway: string,
    controllerPath?: string,
    staticRootDirectory: string,
    proxy?: import("maishu-node-mvc").Config["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
}


export function start(config: Config) {
    if (!config.staticRootDirectory)
        throw errors.settingItemNull("clientRootDirectory");

    if (!path.isAbsolute(config.staticRootDirectory))
        throw errors.notAbsolutePath(config.staticRootDirectory);

    if (!fs.existsSync(config.staticRootDirectory))
        throw errors.directoryNotExists(config.staticRootDirectory);

    let stat = fs.statSync(config.staticRootDirectory);
    if (!stat.isDirectory())
        throw errors.pathIsNotDirectory(config.staticRootDirectory);

    // var node_modules_path = path.join(__dirname, "../../node_modules")
    // if (!fs.existsSync(node_modules_path)) {
    //     var appDir = path.dirname(require.main.filename);
    //     node_modules_path = path.join(appDir, 'node_modules');
    // }


    let innerStaticRootDirectory = path.join(__dirname, "../public");
    let virtualPaths = createVirtulaPaths(innerStaticRootDirectory, config.staticRootDirectory);
    virtualPaths["assert"] = path.join(innerStaticRootDirectory, "assert");
    // virtualPaths["lib"] = path.join(__dirname, '../../lib');
    // console.assert(fs.existsSync(virtualPaths["lib"]));
    // virtualPaths["node_modules"] = node_modules_path;

    virtualPaths = Object.assign(config.virtualPaths || {}, virtualPaths);

    // settings.gateway = config.gateway;
    // settings.clientStaticRoot = config.staticRootDirectory;
    // settings.innerStaticRoot = innerStaticRootDirectory;

    startServer({
        port: config.port,
        staticRootDirectory: config.staticRootDirectory,
        controllerDirectory: config.controllerPath ? [path.join(__dirname, './controllers'), config.controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths,
        proxy: config.proxy,
        bindIP: config.bindIP,
        actionFilters: [
            (req, res) => {
                let settings: Settings = {
                    clientStaticRoot: config.staticRootDirectory,
                    gateway: config.gateway,
                    innerStaticRoot: innerStaticRootDirectory,
                }
                req.headers[SettingsHeaderName] = JSON.stringify(settings);

                return null;
            }
        ]
    });
}

function createVirtulaPaths(rootAbsolutePath: string, clientRootAbsolutePath: string) {
    let virtualPaths: { [path: string]: string } = {}
    let virtualPahtStack: string[] = [""];
    while (virtualPahtStack.length > 0) {
        let virtualPath = virtualPahtStack.pop();
        let absolutePath = path.join(rootAbsolutePath, virtualPath);
        let stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) {
            let r = fs.readdirSync(absolutePath);
            let paths = r.map(o => `${virtualPath}/${o}`);
            virtualPahtStack.push(...paths);
        }
        else if (stat.isFile()) {
            let clientFilePath = path.join(clientRootAbsolutePath, virtualPath);
            if (!fs.existsSync(clientFilePath))
                virtualPaths[virtualPath] = absolutePath;
        }
    }

    return virtualPaths;
}
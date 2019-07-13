import { startServer } from 'maishu-node-mvc'
import { settings } from './settings';
import { errors } from './errors';
import path = require('path')
import fs = require("fs");

interface Config {
    port: number,
    roleId: string,
    gateway: string,
    controllerPath: string,
    staticRootDirectory: string,
}

var appDir = path.dirname(require.main.filename);
var node_modules_path = path.join(appDir, 'node_modules')

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

    let innerStaticRootDirectory = path.join(__dirname, "../public");
    let virtualPaths = createVirtulaPaths(innerStaticRootDirectory, config.staticRootDirectory);
    virtualPaths["assert"] = path.join(__dirname, "assert");
    virtualPaths["lib"] = path.join(__dirname, '../../lib');
    virtualPaths["node_modules"] = node_modules_path;

    settings.roleId = config.roleId;
    settings.gateway = config.gateway;
    settings.clientStaticRoot = config.staticRootDirectory;
    settings.innerStaticRoot = innerStaticRootDirectory;

    startServer({
        port: config.port,
        rootPath: __dirname,
        staticRootDirectory: config.staticRootDirectory,
        controllerDirectory: config.controllerPath ? [path.join(__dirname, './controllers'), config.controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths
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
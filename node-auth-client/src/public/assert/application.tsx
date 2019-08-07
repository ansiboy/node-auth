
import * as chitu_react from 'maishu-chitu-react';
import { MasterPage } from './masters/master-page';
import 'text!../content/admin_style_default.less'
import { PageData, Page, ValueStore } from "maishu-chitu"
import errorHandle from 'error-handle';
import { MainMasterPage } from './masters/main-master-page';
import { PermissionService } from './services/index';
import { LoginInfo } from './services/service';
import UrlPattern = require("url-pattern");

export class Application extends chitu_react.Application {
    pageMasters: { [key: string]: string } = {}
    masterPages = {
        simple: null as MasterPage<any>,
        default: null as MainMasterPage
    }
    masterElements: { [key: string]: HTMLElement } = {}

    loginInfo: ValueStore<LoginInfo> = PermissionService.loginInfo;
    // modulesPath: { [path: string]: string } = {};
    modulePathPatterns: { source: UrlPattern, target: UrlPattern }[] = [];

    constructor(simpleContainer: HTMLElement, mainContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer
            },
            modulesPath: ""
        })

        this.error.add((sender, error, page) => errorHandle(error, sender, page as chitu_react.Page))
    }

    setModulePath(pathPattern: string, targetPattern: string) {
        this.modulePathPatterns.push({
            source: new UrlPattern(pathPattern),
            target: new UrlPattern(targetPattern)
        });
    }

    loadjs(path) {
        let isMatch = false;
        for (let i = 0; i < this.modulePathPatterns.length; i++) {
            let { source, target } = this.modulePathPatterns[i];
            let m = source.match(path);
            if (m != null) {
                path = target.stringify(m);
                isMatch = true;
                break;
            }
        }

        if (isMatch == false) {
            path = "modules/" + path;
        }

        return super.loadjs(path);
    }

    createPageElement(pageName: string, containerName: string) {
        let element = super.createPageElement(pageName, containerName);
        let master = this.masterPages[containerName];
        console.assert(master != null);
        master.pageContainer.appendChild(element);
        return element;
    }

    showPage(pageUrl: string, args?: PageData, forceRender?: boolean): Page {
        args = args || {}
        let d = this.parseUrl(pageUrl)
        let names = ['login', 'forget-password', 'register']
        if (names.indexOf(d.pageName) >= 0) {
            args.container = 'simple'
        }
        return super.showPage(pageUrl, args, forceRender)
    }
}


export let app = new Application(document.getElementById('simple-master'), document.getElementById('main-master'))












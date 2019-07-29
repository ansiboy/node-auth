
import * as chitu_react from 'maishu-chitu-react';
import { MasterPage } from './masters/master-page';
import 'text!../content/admin_style_default.less'
import { PageData, Page, ValueStore } from "maishu-chitu"
import errorHandle from 'error-handle';
import { MainMasterPage } from './masters/main-master-page';
import { PermissionService } from './services/index';
import { LoginInfo } from './services/service';

export class Application extends chitu_react.Application {
    pageMasters: { [key: string]: string } = {}
    masterPages = {
        simple: null as MasterPage<any>,
        default: null as MainMasterPage
    }
    masterElements: { [key: string]: HTMLElement } = {}

    loginInfo: ValueStore<LoginInfo> = PermissionService.loginInfo;

    constructor(simpleContainer: HTMLElement, mainContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer
            }
        })

        this.error.add((sender, error, page) => errorHandle(error, sender, page as chitu_react.Page))
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













import * as chitu_react from 'maishu-chitu-react';
import { MasterPage } from './masters/master-page';
import { MainMasterPage } from './masters/main-master-page';
import 'text!../content/admin_style_default.less'
import { PageData, Page } from "maishu-chitu"
import errorHandle from 'error-handle';

export class Application extends chitu_react.Application {
    pageMasters: { [key: string]: string } = {}
    masterPages: { [key: string]: MasterPage<any> } = {}
    masterElements: { [key: string]: HTMLElement } = {}
    masterPage: MainMasterPage;

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

    // get userId() {
    //     if (PermissionService.loginInfo.value == null)
    //         return null

    //     return PermissionService.loginInfo.value.userId
    // }

    // get token() {
    //     if (PermissionService.loginInfo.value == null)
    //         return null

    //     return PermissionService.loginInfo.value.token
    // }

    // get config() {
    //     return config
    // }

    // logout() {

    // }
}

// let masterPages = {
//     simple: null as MasterPage<any>,
//     default: null as MainMasterPage
// }
// async function createMasterPages(app: Application): Promise<{ simple: HTMLElement, main: HTMLElement }> {
//     return new Promise<{ simple: HTMLElement, main: HTMLElement }>((resolve, reject) => {
//         let container = document.createElement('div')

//         ReactDOM.render(<SimpleMasterPage app={app} ref={e => masterPages.simple = e || masterPages.simple} />, document.getElementById('simple-master'))
//         ReactDOM.render(<MainMasterPage app={app} ref={e => masterPages.default = e || masterPages.default} />, document.getElementById('main-master'))
//         document.body.appendChild(container)


//         // let appService = app.createService(AppService)
//         // if (app.userId) {
//         //     appService.menuList().then(menuItems => {
//         //         masterPages.default.setMenus(menuItems)
//         //     })
//         // }
//     })
// }


export let app = new Application(document.getElementById('simple-master'), document.getElementById('main-master'))

// createMasterPages(app)











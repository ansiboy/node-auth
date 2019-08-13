import React = require('react');
import { Application } from '../application';
import { MasterPage, MasterPageProps } from './master-page';
import { masterPageNames } from './names';
import { Resource } from 'entities';
import { PermissionService, Service } from 'assert/services/index';
import { translateToMenuItems } from 'assert/dataSources';
import { LoginInfo } from 'assert/services/service';
import { ValueStore } from 'maishu-chitu';

export type MenuItem = Resource & {
    icon?: string, parent: MenuItem, children: MenuItem[],
}

interface State {
    currentPageName?: string,
    toolbar?: JSX.Element,
    menus: MenuItem[],
    resourceId?: string,
    /** 不显示菜单的页面 */
    hideMenuPages?: string[],
    username?: string,
    roleName?: string,
}

export class MainMasterPage extends MasterPage<State> {

    name = masterPageNames.main

    pageContainer: HTMLElement;
    element: HTMLElement;
    private app: Application;
    ps: PermissionService;
    menuResources = new ValueStore<Resource[]>([]);

    constructor(props: MasterPageProps) {
        super(props);

        let username = Service.loginInfo.value ? Service.loginInfo.value.username : "";
        this.state = { menus: [], username: username }

        this.app = props.app;
        this.ps = this.app.createService(PermissionService);
        this.menuResources.add((value) => {
            let menuItems = translateToMenuItems(value).filter(o => o.parent == null);
            this.setState({ menus: menuItems })
        })
    }

    private showPageByNode(node: MenuItem) {
        let children = node.children || []
        if (!node.page_path && (node.children || []).length > 0) {
            this.showPageByNode(children[0])
            return
        }
        let pagePath = node.page_path;
        if (pagePath == null && children.length > 0) {
            node = children[0];
            pagePath = node.page_path;
        }

        if (!pagePath) {
            console.log(`MenuItem ${node.name} page name is empty.`);
            return;
        }

        if (pagePath.startsWith("#")) {
            pagePath = pagePath.substr(1);
            this.app.redirect(pagePath, { resourceId: node.id });
            return;
        }

        this.app.redirect("outer-page", { target: pagePath, resourceId: node.id });
    }

    formatString(s: string, args: string[]) {
        // var s = arguments[0];
        for (var i = 0; i < args.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, args[i]);
        }
        return s;
    }

    private findMenuItemByResourceId(menuItems: MenuItem[], resourceId: string) {
        let stack = new Array<MenuItem>()
        stack.push(...menuItems)
        while (stack.length > 0) {
            let item = stack.pop()
            if (item == null)
                return

            if (item.id == resourceId)
                return item

            let children = item.children || []
            stack.push(...children)
        }

        return null
    }

    private findMenuItemByPageName(menuItems: MenuItem[], pageName: string) {
        let stack = new Array<MenuItem>()
        stack.push(...menuItems)
        while (stack.length > 0) {
            let item = stack.pop()
            if (item == null)
                throw new Error("item is null")

            if (item.page_path) {
                let obj = this.app.parseUrl(item.page_path) || { pageName: '' }
                if (obj.pageName == pageName)
                    return item
            }

            let children = item.children || []
            stack.push(...children)
        }

        return null
    }

    logout() {
        let s = this.app.createService(PermissionService)
        s.user.logout()
        location.href = `?${Date.now()}#login`
    }

    /**
     * 加载用户登录后所要显示的数据
     */
    async loadUserData(loginInfo: LoginInfo) {
        this.ps.resource.list().then(resources => {
            this.menuResources.value = resources;
        })

        this.setState({
            username: loginInfo.username,
        });

        if (loginInfo.roleId) {
            let role = await this.ps.role.item(loginInfo.roleId);
            if (role) {
                this.setState({ roleName: role.name });
            }
        }
    }

    clearUserData() {
        this.setState({ menus: [], username: null, roleName: null })
    }

    // get menuItems(): MenuItem[] {
    //     return this.state.menus;
    // }

    componentDidMount() {
        this.app.pageCreated.add((sender, page) => {
            page.shown.add(() => {
                this.setState({ currentPageName: page.name })
                this.setState({ resourceId: (page.data.resourceId || page.data.resource_id) as string })
            })
        })

        Service.loginInfo.attach((value) => {
            if (value) {
                this.loadUserData(value);
            }
            else {
                this.clearUserData();
            }
        });
    }

    render() {
        let { menus: menuData, username, roleName } = this.state;
        let currentPageName: string = this.state.currentPageName || '';

        let firstLevelNodes = menuData.filter(o => o.type == "menu");
        let currentNode: MenuItem | null | undefined
        if (this.state.resourceId) {
            currentNode = this.findMenuItemByResourceId(firstLevelNodes, this.state.resourceId)
        }
        else if (currentPageName) {
            currentNode = this.findMenuItemByPageName(firstLevelNodes, currentPageName)
        }
        let firstLevelNode: MenuItem | null = null;
        let secondLevelNode: MenuItem;


        if (currentNode != null) {
            if (currentNode.parent == null) {
                firstLevelNode = currentNode
            }
            else if (currentNode.parent.parent == null) {   //二级菜单
                firstLevelNode = currentNode.parent
                secondLevelNode = currentNode
            }
            else if (currentNode.parent.parent.parent == null) {   //三级菜单
                firstLevelNode = currentNode.parent.parent
                secondLevelNode = currentNode.parent
            }
        }

        let nodeClassName = '';
        let hideMenuPages = this.state.hideMenuPages || []
        if (hideMenuPages.indexOf(currentPageName) >= 0) {
            nodeClassName = 'hideFirst';
        }
        else if (firstLevelNode == null || (firstLevelNode.children || []).filter(o => o.type == "menu").length == 0) {
            nodeClassName = 'hideSecond';
        }

        return (
            <div className={`${nodeClassName}`} ref={e => this.element = e || this.element}>
                <div className="first">
                    <ul className="list-group">
                        {firstLevelNodes.map((o, i) =>
                            <li key={i} className={o == firstLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.type != "menu" ? "none" : '' }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon}></i>
                                <span>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="second">
                    <ul className="list-group">
                        {(firstLevelNode ? (firstLevelNode.children || []) : []).filter(o => o.type == "menu").map((o, i) =>
                            <li key={i} className={o == secondLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.type != "menu" ? "none" : '' }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon}></i>
                                <span>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="main">
                    <nav className="navbar navbar-default">
                        <ul className="toolbar">
                            {this.state.toolbar}
                            <li className="light-blue pull-right" onClick={() => this.logout()}>
                                <i className="icon-off"></i>
                                <span style={{ paddingLeft: 4, cursor: "pointer" }}>退出</span>
                            </li>
                            <li className="light-blue pull-right" style={{ marginRight: 10 }}>
                                {username || ""}{roleName ? `  (${roleName})` : ""}
                            </li>
                        </ul>
                    </nav>
                    <div className={`page-container page-placeholder`}
                        ref={(e: HTMLElement) => this.pageContainer = e || this.pageContainer}>
                    </div>
                </div>
            </div >
        );
    }
}





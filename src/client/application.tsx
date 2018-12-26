import { app, MenuItem as Menu } from 'maishu-chitu-admin'
export { app } from 'maishu-chitu-admin'
import * as ui from 'maishu-ui-toolkit'
import { UserService } from './services/user'
import React = require('react')

app.masterPage.setHideMenuPages(['forget-password', 'index', 'login', 'register'])

app.error.add((sender, error, page) => {
    ui.alert({ title: '错误', message: error.message })
})

let userService = new UserService();
userService.resources().then(resources => {
    let menus = resources.filter(o => o.parent_id == null)
        .map(o => ({
            id: o.id, name: o.name, visible: o.visible,
            path: `${o.path}?resource_id=${o.id}`
        } as Menu))

    for (let i = 0; i < menus.length; i++) {
        menus[i].children = resources.filter(o => o.parent_id == menus[i].id)
            .map(o => ({
                id: o.id,
                name: o.name,
                path: o.path,
                parent: menus[i],
                visible: o.visible,
            } as Menu))
    }
    app.masterPage.setMenus(menus)
})


class Toolbar extends React.Component<{}, { currentPageName: string }> {
    constructor(props) {
        super(props)

        this.state = { currentPageName: null }
    }
    componentDidMount() {
        app.pageShowing.add((sender, page) => {
            this.setState({ currentPageName: page.name })
        })
    }
    render() {
        let showLoginButton = ['forget-password', 'login', 'register'].indexOf(this.state.currentPageName) < 0;
        return <ul>
            {showLoginButton ? <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                onClick={() => {
                    userService.logout()
                    app.redirect('login')
                }}>
                <i className="icon-off"></i>
                <span style={{ paddingLeft: 4 }}>退出</span>
            </li> : null}
        </ul>
    }
}

app.masterPage.setToolbar(<Toolbar />)






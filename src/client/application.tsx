import { app } from 'maishu-chitu-admin'
export { app } from 'maishu-chitu-admin'
import { UserService } from './services/user'
export { UserService } from './services/user'
import React = require('react')
import { Application, Page } from 'chitu';

app.masterPage.setHideMenuPages(['forget-password', 'login', 'register'])

class Toolbar extends React.Component<{}, { currentPageName: string }> {

    private pageShowin = (sender: Application, page: Page) => {
        this.setState({ currentPageName: page.name })

    }

    constructor(props) {
        super(props)

        this.state = { currentPageName: null }
        this.init()
    }
    private init() {
        const LOGIN_INFO = 'app-login-info'
        if (localStorage[LOGIN_INFO]) {
            let obj = JSON.parse(localStorage[LOGIN_INFO])
            UserService.loginInfo.value = obj
            // this.loadUserInfo(this.loginInfo.value.userId)
            // instanceMessangerStart(UserService.loginInfo.value.userId, this.createService(MessageService))
        }

        UserService.loginInfo.add((value) => {
            if (!value) {
                localStorage.removeItem(LOGIN_INFO)
                // this.isDistributorAuth.value = false
                // this.isPersonAuth.value = false
                // instanceMessangerStop()
            }
            else {
                localStorage.setItem(LOGIN_INFO, JSON.stringify(value));
                // this.loadUserInfo(value.userId)
                // instanceMessangerStart(value.userId, this.createService(MessageService))
            }


        });
    }


    get userId() {
        if (UserService.loginInfo.value == null)
            return null

        return UserService.loginInfo.value.userId
    }

    componentDidMount() {
        app.pageShowing.add(this.pageShowin)
    }
    componentWillUnmount() {
        app.pageShowing.remove(this.pageShowin)
    }
    render() {
        let showLoginButton = ['forget-password', 'login', 'register'].indexOf(this.state.currentPageName) < 0;
        return <ul>
            {showLoginButton ? <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                onClick={() => {
                    logout()
                    app.redirect('login')
                }}>
                <i className="icon-off"></i>
                <span style={{ paddingLeft: 4 }}>退出</span>
            </li> : null}
        </ul>
    }
}

export function logout() {
    let userService = app.createService(UserService);
    userService.logout()
}

app.masterPage.setToolbar(<Toolbar />)






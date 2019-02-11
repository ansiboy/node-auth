import React = require("react");
import { FormValidator, rules as r } from 'maishu-dilu';
import { Application } from 'maishu-chitu-admin'
import { UserService } from "../services/user";
import * as ui from "maishu-ui-toolkit"
import { config } from "../config";

interface Props {
    app: Application,
    redirect?: string
}

interface State {
    buttonText: string,
    buttonEnable: boolean,
    username?: string,
    password?: string,
}

export default class LoginPage extends React.Component<Props, State> {
    private element: HTMLElement;
    private validator: FormValidator;

    constructor(props) {
        super(props)

        this.state = {
            buttonText: '发送验证码', buttonEnable: true
        }
    }

    async login() {
        if (!this.validator.check()) {
            return
        }

        let userService = this.props.app.currentPage.createService(UserService);
        let { username, password } = this.state
        await userService.login(username, password)

        let redirect = this.props.redirect
        if (redirect) {
            let r = this.props.app.parseUrl(redirect)
            this.props.app.redirect(r.pageName, r.values)
            return
        }

        let indexPageName = this.props.app.config.login.indexPageName || 'index'
        this.props.app.redirect(indexPageName)
    }

    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'username', rules: [r.required('请输入用户名')] },
            { name: 'password', rules: [r.required('请输入密码')] }
        )
    }

    render() {
        let { username, password } = this.state
        return <>
            <h1 key={8} className="text-center" style={{ paddingBottom: 50 }}>{config.login.title}</h1>
            <div key={10} className="form-horizontal container" style={{ maxWidth: 500 }}
                ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="form-group" >
                    <label className="col-sm-2 control-label">用户名</label>
                    <div className="col-sm-10" >
                        <input name="username" type="text" className="form-control"
                            value={username || ''}
                            onChange={e => {
                                this.setState({ username: e.target.value })
                            }} />
                    </div>
                </div>
                <div className="form-group" >
                    <label className="col-sm-2 control-label">密码</label>
                    <div className="col-sm-10">
                        <input type="password" name="password" className="form-control"
                            value={password || ''}
                            onChange={e => {
                                this.setState({ password: e.target.value })
                            }} />
                    </div>
                </div>
                <div className="form-group" >
                    <div className="col-sm-offset-2 col-sm-10" >
                        <button type="button" className="btn btn-primary btn-block"
                            ref={(e) => {
                                if (!e) return;
                                e.onclick = ui.buttonOnClick(() => this.login())
                            }}>
                            <i className="icon-key"></i>
                            立即登录
                    </button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10" >
                        {config.login.showForgetPassword ?
                            <div className="pull-left" >
                                <button className="btn-link"
                                    onClick={() => this.props.app.redirect("forget-password")}>
                                    忘记密码
                            </button>
                            </div> : null}
                        {config.login.showRegister ?
                            <div className="pull-right" >
                                <button className="btn-link"
                                    onClick={() => this.props.app.redirect("register")} >
                                    注册
                            </button>
                            </div> : null}
                    </div>
                </div>
            </div>
        </>
    }
}
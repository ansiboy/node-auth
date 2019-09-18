import React = require("react");
import { config } from "../config";
import { PageProps } from "maishu-chitu-react";
import { setForm as setLoginForm, USERNAME, PASSWORD, LOGIN } from "assert/forms/login";

interface Props extends PageProps {
    data: {
        redirect?: string
    }
}

interface State {
    buttonText: string,
    buttonEnable: boolean,
    username?: string,
    password?: string,
}

export default class LoginPage extends React.Component<Props, State> {
    private element: HTMLElement;
    constructor(props) {
        super(props)

        this.state = {
            buttonText: '发送验证码', buttonEnable: true
        }
    }

    componentDidMount() {
        let redirectURL = this.props.data.redirect || config.loginRedirectURL || '#index'
        setLoginForm(this.element, { redirectURL }, this.props.app)
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
                        <input name={USERNAME} type="text" className="form-control"
                            value={username || ''}
                            onChange={e => {
                                this.setState({ username: e.target.value })
                            }} />
                    </div>
                </div>
                <div className="form-group" >
                    <label className="col-sm-2 control-label">密码</label>
                    <div className="col-sm-10">
                        <input type="password" name={PASSWORD} className="form-control"
                            value={password || ''}
                            onChange={e => {
                                this.setState({ password: e.target.value })
                            }} />
                    </div>
                </div>
                <div className="form-group" >
                    <div className="col-sm-offset-2 col-sm-10" >
                        <button name={LOGIN} type="button" className="btn btn-primary btn-block">
                            <i className="icon-key"></i>
                            立即登录
                    </button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10" >
                        {config.login.showForgetPassword ?
                            <div className="pull-left" >
                                <button name="forget-password" className="btn-link"
                                    onClick={() => this.props.app.redirect("forget-password")}>
                                    忘记密码
                            </button>
                            </div> : null}
                        {config.login.showRegister ?
                            <div className="pull-right" >
                                <button name="register" className="btn-link"
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
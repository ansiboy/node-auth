import React = require("react");
import { PageProps } from "maishu-chitu-react";
import { FormValidator, rules as r } from "maishu-dilu";
import { buttonOnClick } from "maishu-ui-toolkit";
import { LocalService } from "services/local-service";
import config = require("json!websiteConfig");

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

const USERNAME = "username";
const PASSWORD = "password";
const LOGIN = "login";

export default class LoginPage extends React.Component<Props, State> {
    private element: HTMLElement;
    private validator: FormValidator;

    constructor(props) {
        super(props)

        this.state = {
            buttonText: '发送验证码', buttonEnable: true
        }
    }

    async login(): Promise<any> {
        let service = this.props.createService(LocalService);
        let { username, password } = this.state;
        let r = await service.login(username, password);
        let target = config.loginRedirectURL || "index";
        this.props.app.redirect(target);
    }

    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: USERNAME, rules: [r.required('请输入用户名')] },
            { name: PASSWORD, rules: [r.required('请输入密码')] }
        )
    }

    render() {
        let { username, password } = this.state
        return <>
            <h1 key={8} className="text-center" style={{ paddingBottom: 50 }}>好易微商城商户后台</h1>
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
                        <button name={LOGIN} type="button" className="btn btn-primary btn-block"
                            ref={e => {
                                if (!e) return;
                                buttonOnClick(e, () => this.login());
                            }}>
                            <i className="icon-key"></i>
                            立即登录
                    </button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10" >
                        <div className="pull-left" >
                            <button name="forget-password" className="btn-link"
                                onClick={() => this.props.app.redirect("forget-password")}>
                                忘记密码
                            </button>
                        </div>
                        <div className="pull-right" >
                            <button name="register" className="btn-link"
                                onClick={() => this.props.app.redirect("register")} >
                                注册
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

}
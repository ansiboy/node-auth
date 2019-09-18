import React = require("react");
import { setForm, MOBILE, VERIFY_CODE, CONFIRM_PASSWORD, REGISTER, SEND_VERIFY_CODE, PASSWORD } from "assert/forms/register";
import { FormValidator } from "maishu-dilu";
import { config } from "../config";
import { Application, PageProps } from "maishu-chitu-react";

type State = { buttonText: string, buttonEnable: boolean }

export default class RegisterPage extends React.Component<PageProps, State> {
    private formElement: HTMLDivElement;

    constructor(props) {
        super(props)

        this.state = { buttonText: '发送验证码', buttonEnable: true }
    }
    componentDidMount() {
        setForm(this.formElement, { redirectURL: config.registerRedirectURL || 'index' }, this.props.app)
    }
    render() {
        return <div className="container">
            <div ref={o => this.formElement = o || this.formElement} className="User-Register form-horizontal col-md-6 col-md-offset-3">
                <h2>立即注册</h2>
                <hr />
                <div className="form-group">
                    <label className="col-sm-2 control-label">手机号码</label>
                    <div className="col-sm-10">
                        <input name={MOBILE} type="text" className="form-control" />
                        <span className="mobile validationMessage" style={{ display: 'none' }}></span>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">验证码</label>
                    <div className="col-sm-10">

                        <div className="input-group">
                            <input name={VERIFY_CODE} className="form-control" />
                            <span className="input-group-btn">
                                <button name={SEND_VERIFY_CODE} className="btn btn-default" disabled={!this.state.buttonEnable}>
                                    发送验证码
                                </button>
                            </span>
                        </div>
                        <span className={`${VERIFY_CODE} ${FormValidator.errorClassName}`} style={{ display: 'none' }}></span>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">密码</label>
                    <div className="col-sm-10">
                        <input type="password" name={PASSWORD} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">确认密码</label>
                    <div className="col-sm-10">
                        <input type="password" name={CONFIRM_PASSWORD} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button name={REGISTER} className="btn btn-primary btn-block"  >
                            <i className="icon-key"></i>
                            立即注册
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <div className="pull-left">
                            <button className="btn-link"
                                onClick={() => this.props.app.redirect('forget-password')}>
                                忘记密码
                            </button>
                        </div>
                        <div className="pull-right">
                            <button className="btn-link"
                                onClick={() => this.props.app.redirect("login")}>
                                登录
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }
}
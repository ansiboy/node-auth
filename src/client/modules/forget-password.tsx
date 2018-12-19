import React = require("react");
import * as chitu from 'maishu-chitu'

type Props = { app: chitu.Application }
type State = { buttonText: string, buttonEnable: boolean }

export default class ForgetPassword extends React.Component<Props, State> {
    formElement: HTMLDivElement;

    constructor(props) {
        super(props)

        this.state = { buttonText: '发送验证码', buttonEnable: true }
    }

    render() {
        return (
            <div className="container">
                <div ref={o => this.formElement = o} className="User-Register form-horizontal col-md-6 col-md-offset-3">
                    <h2>忘记密码</h2>
                    <hr />
                    <div className="form-group">
                        <label className="col-sm-2 control-label">手机号码</label>
                        <div className="col-sm-10">
                            <input name="mobile" type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">验证码</label>
                        <div className="col-sm-10">
                            <div className="input-group">
                                <input name="verifyCode" className="form-control" />
                                <span className="input-group-btn">
                                    <button onClick={() => this.sendVerifyCode()} className="btn btn-default" disabled={!this.state.buttonEnable}>
                                        {this.state.buttonText}
                                    </button>
                                </span>
                            </div>
                            <span className="" style={{ display: 'none' }}></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">密码</label>
                        <div className="col-sm-10">
                            <input type="password" name="password" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">确认密码</label>
                        <div className="col-sm-10">
                            <input type="password" name="confirmPassword" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-primary btn-block"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    // e.onclick = ui.buttonOnClick(() => this.resetPassword())
                                }}>
                                <i className="icon-key"></i>
                                重置密码
                        </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="pull-left">
                                <button className="btn-link"
                                    onClick={() => this.props.app.redirect("register")}>
                                    注册
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
            </div>
        );
    }
    sendVerifyCode(): void {
        throw new Error("Method not implemented.");
    }
}
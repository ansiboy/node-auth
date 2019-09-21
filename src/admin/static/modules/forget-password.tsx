import React = require("react");
import * as chitu from 'maishu-chitu'
import { RESET_PASSWORD, SEND_VERIFY_CODE, PASSWORD, CONFIRM_PASSWORD, MOBILE, VERIFY_CODE, setForm } from "assert/forms/forget-password";
import { PageProps } from "maishu-chitu-react";

type State = {}

export default class ForgetPassword extends React.Component<PageProps, State> {
    formElement: HTMLDivElement;

    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount() {
        setForm(this.formElement, this.props.app)
    }
    render() {
        return (
            <div className="container">
                <div ref={o => this.formElement = o || this.formElement} className="User-Register form-horizontal col-md-6 col-md-offset-3">
                    <h2>忘记密码</h2>
                    <hr />
                    <div className="form-group">
                        <label className="col-sm-2 control-label">手机号码</label>
                        <div className="col-sm-10">
                            <input name={MOBILE} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">验证码</label>
                        <div key={Math.random()} className="col-sm-10">
                            <div className="input-group">
                                <input name={VERIFY_CODE} className="form-control" />
                                <span className="input-group-btn">
                                    <button name={SEND_VERIFY_CODE} className="btn btn-default" >
                                        发送验证码
                                    </button>
                                </span>
                            </div>
                            <span className="" style={{ display: 'none' }}></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">密码</label>
                        <div className="col-sm-10">
                            <input name={PASSWORD} type="password" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">确认密码</label>
                        <div className="col-sm-10">
                            <input name={CONFIRM_PASSWORD} type="password" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button name={RESET_PASSWORD} className="btn btn-primary btn-block">
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
}
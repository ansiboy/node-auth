import React = require("react");
import { FormValidator, rules } from "maishu-dilu";

import { alert, buttonOnClick } from "maishu-ui-toolkit";
import { PermissionService } from "../../services/permission-service";
import { errorHandle } from "maishu-chitu-admin/static";
import { PageProps } from "maishu-chitu-react";
import { errors } from "../../errors";
import { BasePage } from "../../components/pages/base-page";
import { Role } from "gateway-entities";

const NEW_PASSWORD = "new_password";
const VERIFY_CODE = "verify_code";
const MOBILE = "mobile"

interface State {
    verifyCode?: string,
    newPassword?: string,
    mobile?: string,
    roles?: Role[],
}

export default class ChagePasswordPage extends BasePage<PageProps, State>{
    mobileElement: HTMLElement;
    verifyCodeElement: HTMLElement;
    ps: PermissionService;
    newPasswordElement: any;
    private formElement: HTMLElement;
    private validator: FormValidator;
    private smsId: string;

    constructor(props) {
        super(props);

        this.state = {}
        this.ps = new PermissionService((err) => errorHandle(err));
    }

    save() {
        if (!this.validator.check())
            return Promise.reject();

        if (!this.smsId) {
            alert({ title: "错误", message: "验证码不正确" })
            return Promise.reject("sms is null");
        }

        let { mobile, verifyCode, newPassword } = this.state;

        return this.ps.user.resetPassword(mobile, newPassword, this.smsId, verifyCode);
    }

    componentDidMount() {
        this.ps.user.me().then(user => {
            this.setState({ mobile: user.mobile });
        })

        this.validator = new FormValidator(this.formElement,
            { name: MOBILE, rules: [rules.required("手机号码不能为空")] },
            { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
            { name: NEW_PASSWORD, rules: [rules.required("请输入新密码")] },
        )
    }

    renderToolbarRight() {
        return [
            <button className="btn btn-primary"
                ref={e => {
                    if (!e) return;
                    buttonOnClick(e, () => this.save())
                }}>
                <i className="icon-save" />
                <span>保存</span>
            </button>
        ]
    }

    render() {
        let { mobile, verifyCode, newPassword } = this.state;
        return <>
            <div className="well" ref={e => this.formElement = this.formElement || e}>
                <div style={{ maxWidth: 400 }}>
                    <div className="form-group clearfix input-control">
                        <label>手机号</label>
                        <span>
                            <input name={MOBILE} value={mobile || ""} style={{ border: "none", backgroundColor: "unset", fontWeight: "bold" }} readOnly />
                        </span>
                    </div>
                    <div className="form-group clearfix input-control">
                        <label>验证码</label>
                        <span>
                            <div className="input-group">
                                <input name={VERIFY_CODE} className="form-control"
                                    value={verifyCode || ""}
                                    onChange={e => {
                                        this.setState({ verifyCode: e.target.value })
                                    }}
                                    ref={e => this.verifyCodeElement = e || this.verifyCodeElement}
                                    placeholder="请输入验证码" />
                                <span className="input-group-btn">
                                    <button name="sendVerifyCode" className="btn btn-default"
                                        ref={e => {
                                            if (!e) return;

                                            e.onclick = () => {
                                                if (!this.validator.checkElement(MOBILE))
                                                    return;

                                                sendVerifyCode(e, mobile);
                                            }
                                        }}>
                                        发送验证码
                                    </button>
                                </span>
                            </div>
                            <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
                        </span>
                    </div>
                    <div className="form-group clearfix input-control" >
                        <label>新密码</label>
                        <span>
                            <input name={NEW_PASSWORD} className="form-control" type="password"
                                value={newPassword || ""}
                                onChange={e => {
                                    if (!e) return
                                    this.setState({ newPassword: e.target.value });
                                }}
                                ref={e => this.newPasswordElement = e || this.newPasswordElement}
                                placeholder="请输入新密码" />
                        </span>
                    </div>
                </div>
            </div>
        </>
    }
}

let ps = new PermissionService(err => errorHandle(err));
export async function sendVerifyCode(button: HTMLButtonElement, mobile: string) {
    if (!button) throw errors.argumentNull("button");
    if (!mobile) throw errors.argumentNull("mobile");

    ps.sms.sendResetVerifyCode(mobile)
        .then(r => {
            this.smsId = r.smsId;
        })
        .catch(err => {
            clearInterval(timeId);
            button.disabled = false;
            button.innerHTML = `发送验证码`;
            console.error(err);
        })

    button.disabled = true;
    let seconds = 60;
    button.innerHTML = `${seconds}秒重发`;
    let timeId = setInterval(() => {
        seconds = seconds - 1;
        if (seconds <= 0) {
            clearInterval(timeId);
            button.innerHTML = `发送验证码`;
            button.disabled = false;
            return;
        }

        button.innerHTML = `${seconds}秒重发`;

    }, 1000);
}


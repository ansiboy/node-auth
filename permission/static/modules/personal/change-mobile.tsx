import React = require("react");
import { PermissionService } from "services/permission-service";
import { FormValidator, rules } from "maishu-dilu";
import { PageProps } from "maishu-chitu-react";
import { sendVerifyCode } from "./change-password";
import { BasePage } from "components/pages/base-page";
import { buttonOnClick } from "maishu-ui-toolkit";

const NEW_MOBILE = "new_mobile";
const VERIFY_CODE = "verify_code";
const MOBILE = "mobile"

interface State {
    mobile?: string,
    verifyCode?: string,
    oldMobile?: string,
}

export default class ChangeMobilePage extends BasePage<PageProps, State> {
    private ps: PermissionService;
    private validator: FormValidator;
    private formElement: HTMLElement;

    constructor(props) {
        super(props);

        this.state = {};
        this.ps = this.props.createService(PermissionService);
    }

    async save() {
        if (!this.validator.check())
            return Promise.reject("fail")
    }

    componentDidMount() {
        this.validator = new FormValidator(this.formElement,
            { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
            { name: NEW_MOBILE, rules: [rules.required("请输入新的手机号码"), rules.mobile("请输入正确的手机号码")] }
        );

        this.ps.user.me().then(user => {
            this.setState({ oldMobile: user.mobile });
        })

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
        let { mobile, verifyCode, oldMobile } = this.state;
        return <>
            <div className="well" ref={e => this.formElement = e || this.formElement}>
                <div style={{ maxWidth: 400 }}>
                    <div className="form-group clearfix input-control">
                        <label>手机号</label>
                        <span>
                            <input name={MOBILE} value={oldMobile || ""} style={{ border: "none", backgroundColor: "unset", fontWeight: "bold" }} readOnly />
                        </span>
                    </div>
                    <div className="form-group clearfix input-control" >
                        <label>新手机</label>
                        <span>
                            <input name={NEW_MOBILE} className="form-control"
                                value={mobile || ""}
                                onChange={e => e ? this.setState({ mobile: e.target.value }) : null}
                                placeholder="请输入新手机号码" />
                        </span>
                    </div>
                    <div className="form-group clearfix input-control">
                        <label>验证码</label>
                        <span>
                            <div className="input-group">
                                <input name={VERIFY_CODE} className="form-control" placeholder="请输入验证码"
                                    value={verifyCode || ""}
                                    onChange={e => e ? this.setState({ verifyCode: e.target.value }) : null} />
                                <span className="input-group-btn">
                                    <button name="sendVerifyCode" className="btn btn-default"
                                        ref={e => {
                                            if (!e) return;

                                            e.onclick = () => {
                                                if (!this.validator.checkElement(NEW_MOBILE))
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
                </div>
            </div>
        </>
    }
}
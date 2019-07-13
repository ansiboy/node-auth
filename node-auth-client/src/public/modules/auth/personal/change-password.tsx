import ReactDOM = require("react-dom");
import React = require("react");
import { FormValidator, rules } from "maishu-dilu";
import { PermissionService } from "assert/services/index";
import errorHandle from "error-handle";
import { alert } from "maishu-ui-toolkit";
import { PageProps, Page, errors } from "assert/index";

const NEW_PASSWORD = "new_password";
const VERIFY_CODE = "verify_code";
const MOBILE = "mobile"

interface State {
    verifyCode?: string,
    newPassword?: string,
    mobile?: string,
}

export default class ChagePasswordPage extends React.Component<PageProps, State>{
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

    render() {
        let { mobile, verifyCode, newPassword } = this.state;
        return <Page {...this.props} context={{ save: () => this.save() }}>
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
        </Page>
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

// export default async function (page: Page) {
//     let menuItems = await dataSources.resource.executeSelect({})
//         .then(r => translateToMenuItems(r.dataItems));

//     let validator: FormValidator;
//     let mobileElement: HTMLElement;
//     let newPasswordElement: HTMLInputElement;
//     let verifyCodeElement: HTMLInputElement;

//     let me: User;
//     let smsId: string;

//     new PageView({
//         element: page.element,
//         resourceId: page.data["resourceId"] as string,
//         menuItems,
//         context: {
//             save() {
//                 if (!validator.check())
//                     return Promise.reject();

//                 if (!smsId) {
//                     alert({ title: "错误", message: "验证码不正确" })
//                     return;
//                 }

//                 let verifyCode = verifyCodeElement.value;
//                 return ps.user.resetPassword(me.mobile, newPasswordElement.value, smsId, verifyCode);
//             }
//         }
//     })

//     let bodyElement = document.createElement("div");
//     page.element.appendChild(bodyElement);

//     ReactDOM.render(<div className="well">
//         <div style={{ maxWidth: 400 }}>
//             <div className="form-group clearfix input-control">
//                 <label>手机号</label>
//                 <span>
//                     <label ref={(e) => mobileElement = mobileElement || e}></label>
//                 </span>
//             </div>
//             <div className="form-group clearfix input-control">
//                 <label>验证码</label>
//                 <span>
//                     <div className="input-group">
//                         <input name={VERIFY_CODE} className="form-control"
//                             ref={e => verifyCodeElement = e || verifyCodeElement}
//                             placeholder="请输入验证码" />
//                         <span className="input-group-btn">
//                             <button name="sendVerifyCode" className="btn btn-default"
//                                 ref={e => {
//                                     if (!e) return;
//                                     e.onclick = () => sendVerifyCode(e, (r) => smsId = r);
//                                 }}>
//                                 发送验证码
//                                     </button>
//                         </span>
//                     </div>
//                     <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
//                 </span>
//             </div>
//             <div className="form-group clearfix input-control" >
//                 <label>新密码</label>
//                 <span>
//                     <input name={NEW_PASSWORD} className="form-control" type="password"
//                         ref={e => newPasswordElement = e || newPasswordElement}
//                         placeholder="请输入新密码" />
//                 </span>
//             </div>
//         </div>
//     </div>, bodyElement)


//     validator = new FormValidator(bodyElement,
//         { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
//         { name: NEW_PASSWORD, rules: [rules.required("请输入新密码")] }
//     )

//     let ps = new PermissionService((err) => errorHandle(err))
//     ps.user.me().then(user => {
//         me = user;
//         mobileElement.innerHTML = user.mobile;
//     })
//     //mobileElement
//     async function sendVerifyCode(button: HTMLButtonElement, callback: (smsId: string) => void) {
//         ps.sms.sendResetVerifyCode(me.mobile)
//             .then(r => {
//                 callback(r.smsId);
//             })
//             .catch(err => {

//                 clearInterval(timeId);
//                 button.disabled = false;
//                 button.innerHTML = `发送验证码`;
//                 console.error(err);

//             })

//         button.disabled = true;
//         let seconds = 60;
//         button.innerHTML = `${seconds}秒重发`;
//         let timeId = setInterval(() => {
//             seconds = seconds - 1;
//             if (seconds <= 0) {
//                 clearInterval(timeId);
//                 button.innerHTML = `发送验证码`;
//                 button.disabled = false;
//                 return;
//             }

//             button.innerHTML = `${seconds}秒重发`;

//         }, 1000);
//     }
// }
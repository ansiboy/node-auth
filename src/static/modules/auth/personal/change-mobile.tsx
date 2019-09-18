import React = require("react");
import { PageProps, PageView, Page } from "assert/index";
import { PermissionService } from "assert/services/index";
import { FormValidator, rules } from "maishu-dilu";
import { sendVerifyCode } from "./change-password";

const NEW_MOBILE = "new_mobile";
const VERIFY_CODE = "verify_code";

interface State {
    mobile?: string,
    verifyCode?: string,
}

export default class ChangeMobilePage extends React.Component<PageProps, State> {
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
    }

    render() {
        let { mobile, verifyCode } = this.state;
        return <Page {...this.props} context={{
            save: () => this.save()
        }}>
            <div className="well" ref={e => this.formElement = e || this.formElement}>
                <div style={{ maxWidth: 400 }}>
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
        </Page>
    }
}

// export default async function (page: Page) {
//     let menuItems = await dataSources.resource.executeSelect({})
//         .then(r => translateToMenuItems(r.dataItems));

//     let validator: FormValidator;
//     new PageView({
//         element: page.element,
//         resourceId: page.data["resourceId"] as string,
//         menuItems,
//         render(element: HTMLElement) {
//             ReactDOM.render(<div className="well">
//                 <div style={{ maxWidth: 400 }}>
//                     <div className="form-group clearfix input-control">
//                         <label>验证码</label>
//                         <span>
//                             <div className="input-group">
//                                 <input name={VERIFY_CODE} className="form-control"
//                                     placeholder="请输入验证码" />
//                                 <span className="input-group-btn">
//                                     <button name="sendVerifyCode" className="btn btn-default">
//                                         发送验证码
//                                 </button>
//                                 </span>
//                             </div>
//                             <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
//                         </span>
//                     </div>
//                     <div className="form-group clearfix input-control" >
//                         <label>新手机</label>
//                         <span>
//                             <input name={NEW_MOBILE} className="form-control"
//                                 placeholder="请输入新手机号码" />
//                         </span>
//                     </div>
//                 </div>
//             </div>, element)

//             validator = new FormValidator(element,
//                 { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
//                 { name: NEW_MOBILE, rules: [rules.required("请输入新密码"), rules.mobile("请输入正确的手机号码")] }
//             )
//         },
//         context: {
//             save() {
//                 if (!validator.check())
//                     return Promise.reject();
//             }
//         }
//     })
// }
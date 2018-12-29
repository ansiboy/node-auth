(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    class RegisterPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { buttonText: '发送验证码', buttonEnable: true };
        }
        render() {
            return React.createElement("div", { className: "container" },
                React.createElement("div", { ref: o => this.formElement = o, className: "User-Register form-horizontal col-md-6 col-md-offset-3" },
                    React.createElement("h2", null, "\u7ACB\u5373\u6CE8\u518C"),
                    React.createElement("hr", null),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u624B\u673A\u53F7\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { name: "mobile", type: "text", className: "form-control" }),
                            React.createElement("span", { className: "mobile validationMessage", style: { display: 'none' } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u9A8C\u8BC1\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("div", { className: "input-group" },
                                React.createElement("input", { name: "verifyCode", className: "form-control" }),
                                React.createElement("span", { className: "input-group-btn" },
                                    React.createElement("button", { className: "btn btn-default", disabled: !this.state.buttonEnable }, this.state.buttonText))),
                            React.createElement("span", { className: "", style: { display: 'none' } }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "password", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { className: "col-sm-2 control-label" }, "\u786E\u8BA4\u5BC6\u7801"),
                        React.createElement("div", { className: "col-sm-10" },
                            React.createElement("input", { type: "password", name: "confirmPassword", className: "form-control" }))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                    if (!e)
                                        return;
                                    // e.onclick = ui.buttonOnClick(() => this.register())
                                } },
                                React.createElement("i", { className: "icon-key" }),
                                "\u7ACB\u5373\u6CE8\u518C"))),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-sm-offset-2 col-sm-10" },
                            React.createElement("div", { className: "pull-left" },
                                React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect('forget-password') }, "\u5FD8\u8BB0\u5BC6\u7801")),
                            React.createElement("div", { className: "pull-right" },
                                React.createElement("button", { className: "btn-link", onClick: () => this.props.app.redirect("login") }, "\u767B\u5F55"))))));
        }
    }
    exports.default = RegisterPage;
});

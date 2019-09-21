import React = require("react");
import { PageView as BasePageView } from "../controls/index";
import { PermissionService } from "assert/services/index";
import errorHandle from "error-handle";
import { translateToMenuItems } from "assert/dataSources";

let ps = new PermissionService((err) => errorHandle(err));
export class Page extends React.Component<{ data: { resourceId: string } } & { context?: object }> {
    element: HTMLElement;
    async componentDidMount() {
        let resoutces = await ps.resource.list();
        new BasePageView({
            element: this.element,
            resourceId: this.props.data.resourceId,
            menuItems: translateToMenuItems(resoutces),
            context: this.props.context
        })
    }
    render() {
        return <React.Fragment>
            <div ref={e => this.element = e || this.element}></div>
            {this.props.children}
        </React.Fragment>
    }
}
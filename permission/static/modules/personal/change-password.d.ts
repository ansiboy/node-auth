/// <reference types="react" />
import { PermissionService } from "services/permission-service";
import { PageProps } from "maishu-chitu-react";
import { BasePage } from "components/pages/base-page";
import { Role } from "gateway-entities";
interface State {
    verifyCode?: string;
    newPassword?: string;
    mobile?: string;
    roles?: Role[];
}
export default class ChagePasswordPage extends BasePage<PageProps, State> {
    mobileElement: HTMLElement;
    verifyCodeElement: HTMLElement;
    ps: PermissionService;
    newPasswordElement: any;
    private formElement;
    private validator;
    private smsId;
    constructor(props: any);
    save(): any;
    componentDidMount(): void;
    renderToolbarRight(): JSX.Element[];
    render(): JSX.Element;
}
export declare function sendVerifyCode(button: HTMLButtonElement, mobile: string): Promise<void>;
export {};

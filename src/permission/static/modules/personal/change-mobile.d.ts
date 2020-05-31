/// <reference types="react" />
import { PageProps } from "maishu-chitu-react";
import { BasePage } from "../../components/pages/base-page";
interface State {
    mobile?: string;
    verifyCode?: string;
}
export default class ChangeMobilePage extends BasePage<PageProps, State> {
    private ps;
    private validator;
    private formElement;
    constructor(props: any);
    save(): Promise<never>;
    componentDidMount(): void;
    renderToolbarRight(): JSX.Element[];
    render(): JSX.Element;
}
export {};

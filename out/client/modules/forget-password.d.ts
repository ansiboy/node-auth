import React = require("react");
import * as chitu from 'maishu-chitu';
declare type Props = {
    app: chitu.Application;
};
declare type State = {
    buttonText: string;
    buttonEnable: boolean;
};
export default class ForgetPassword extends React.Component<Props, State> {
    formElement: HTMLDivElement;
    constructor(props: any);
    render(): JSX.Element;
    sendVerifyCode(): void;
}
export {};

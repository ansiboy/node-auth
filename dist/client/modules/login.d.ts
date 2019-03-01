import React = require("react");
import { Application } from 'maishu-chitu-admin';
interface Props {
    app: Application;
    redirect?: string;
}
interface State {
    buttonText: string;
    buttonEnable: boolean;
    username?: string;
    password?: string;
}
export default class LoginPage extends React.Component<Props, State> {
    private element;
    private validator;
    constructor(props: any);
    login(): Promise<void>;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};

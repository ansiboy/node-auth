import React = require("react");
declare type Props = {
    app: chitu.Application;
};
declare type State = {
    buttonText: string;
    buttonEnable: boolean;
};
export default class RegisterPage extends React.Component<Props, State> {
    private formElement;
    constructor(props: any);
    render(): JSX.Element;
}
export {};

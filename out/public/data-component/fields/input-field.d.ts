import React = require("react");
import { ValidateDataField } from "data-component/common";
interface InputFieldProps {
    dataField: string;
    label: string;
    name?: string;
    placeholder?: string;
    type?: 'text' | 'password';
}
export declare class InputField extends React.Component<InputFieldProps & ValidateDataField> {
    input: HTMLInputElement;
    constructor(props: any);
    readonly value: string;
    render(): JSX.Element;
}
export {};

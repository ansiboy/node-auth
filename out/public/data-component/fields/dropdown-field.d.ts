import React = require("react");
import { Rule } from "maishu-dilu";
import { NameValue } from "../common";
interface DropdownFieldProps<T> {
    dataField: keyof T;
    label: string;
    name?: string;
    placeholder?: string;
    items: () => Promise<NameValue[]>;
    validateRules?: Rule[];
    onChange?: (value: string, dataItem: T) => void;
}
interface DropdownFieldState {
}
export declare class DropdownField<T> extends React.Component<DropdownFieldProps<T>, DropdownFieldState> {
    constructor(props: DropdownField<T>['props']);
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};

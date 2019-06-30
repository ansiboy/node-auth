import React = require("react");
import { DataSource } from "maishu-wuzhui";
interface RadioFieldProps {
    dataField: string;
    label: string;
    name?: string;
    dataType: 'string' | 'number';
    items: {
        name: string;
        value: string | number;
    }[];
    defaultValue?: string | number;
}
export declare class RadioField extends React.Component<RadioFieldProps, {
    value?: string;
}> {
    constructor(props: RadioField['props']);
    render(): JSX.Element;
}
interface RadioFieldProps1<T> {
    dataField: string;
    label: string;
    dataType: 'string' | 'number';
    defaultValue?: string | number;
    dataSource: DataSource<T>;
    nameField: keyof T;
    valueField: keyof T;
}
export declare class RadioField1<T> extends React.Component<RadioFieldProps1<T>, {
    value?: string;
}> {
    constructor(props: RadioField1<T>['props']);
    render(): JSX.Element;
}
export {};

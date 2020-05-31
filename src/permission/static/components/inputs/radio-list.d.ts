/// <reference types="react" />
import { DataSource } from "maishu-wuzhui";
import { InputControl } from "./input-control";
interface RadioFieldProps<T, S> {
    dataField: keyof T;
    dataType: 'string' | 'number';
    defaultValue?: string | number;
    dataSource: DataSource<S>;
    nameField: Extract<keyof S, string>;
    valueField: Extract<keyof S, string>;
}
interface RadioFieldState {
    items: {
        text: any;
        value: any;
    }[];
    value?: any;
}
export declare class RadioListInput<T, S> extends InputControl<T, RadioFieldProps<T, S>, RadioFieldState> {
    constructor(props: RadioListInput<T, S>['props']);
    set value(value: any);
    get value(): any;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};

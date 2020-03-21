/// <reference types="react" />
import { InputControl, InputControlProps } from "./input-control";
interface InputFieldProps<T> extends InputControlProps<T> {
    placeholder?: string;
    type?: 'text' | 'password';
    dataType: 'string' | 'number';
}
interface InputFieldState {
    value?: string | number;
}
export declare class TextInput<T> extends InputControl<T, InputFieldProps<T>, InputFieldState> {
    input: HTMLInputElement;
    constructor(props: any);
    get value(): InputFieldState["value"];
    set value(value: InputFieldState["value"]);
    render(): JSX.Element;
}
export {};

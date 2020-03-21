import React = require("react");
import { ValidateDataField } from "../item-dialog";
export interface InputControlProps<T> extends ValidateDataField {
    dataField: keyof T;
}
export declare abstract class InputControl<T, P extends InputControlProps<T> = InputControlProps<T>, S = {}> extends React.Component<P, S> {
    static defaultProps: InputControlProps<any>;
    abstract set value(value: any);
    abstract get value(): any;
    id: string;
    constructor(props: InputControl<T, P>["props"]);
}
